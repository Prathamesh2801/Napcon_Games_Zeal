<?php

const DATA_DIR = __DIR__ . '/data';
const GAMES = ['lungs' => 'Lungs Game'];
const COLUMNS = ['id' => 'ID', 'name' => 'Name', 'phone' => 'Phone', 'gameName' => 'Game', 'registeredAt' => 'Registered At', 'savedAt' => 'Saved At'];

header('Content-Type: application/json; charset=utf-8');

function reply(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function clean(array $in): array
{
    $name = trim(preg_replace('/\s+/u', ' ', (string)($in['name'] ?? '')));
    $phone = (string)($in['phone'] ?? '');
    $game = (string)($in['game'] ?? '');
    $at = (string)($in['registeredAt'] ?? '');

    $errors = [];
    if (mb_strlen($name) > 60 || !preg_match("/^[\\p{L} .'-]*$/u", $name)) $errors['name'] = 'Invalid name';
    if ($phone !== '' && !preg_match('/^\d{10}$/', $phone)) $errors['phone'] = 'Phone must be 10 digits';
    if (!isset(GAMES[$game])) $errors['game'] = 'Unknown game';
    if ($at !== '' && strtotime($at) === false) $errors['registeredAt'] = 'Invalid date';
    if ($errors) reply(400, ['ok' => false, 'errors' => $errors]);

    return ['name' => $name, 'phone' => $phone, 'game' => $game, 'gameName' => GAMES[$game], 'registeredAt' => $at];
}

function save(array $entry): array
{
    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0775, true)) throw new RuntimeException('Cannot create data folder');

    $lock = fopen(DATA_DIR . '/.lock', 'c');
    flock($lock, LOCK_EX);
    try {
        $base = DATA_DIR . '/' . $entry['game'] . '-registrations';
        $jsonPath = $base . '.json';
        $rows = is_file($jsonPath) ? (json_decode(file_get_contents($jsonPath), true) ?: []) : [];

        $entry = ['id' => count($rows) + 1] + $entry + ['savedAt' => date('Y-m-d H:i:s')];
        $rows[] = $entry;

        file_put_contents($jsonPath . '.tmp', json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        rename($jsonPath . '.tmp', $jsonPath);

        $csvPath = $base . '.csv';
        $isNew = !is_file($csvPath);
        $csv = fopen($csvPath, 'a');
        if ($isNew) {
            fwrite($csv, "\xEF\xBB\xBF");
            fputcsv($csv, array_values(COLUMNS));
        }
        fputcsv($csv, array_map(fn($k) => $entry[$k], array_keys(COLUMNS)));
        fclose($csv);

        return $entry;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['ok' => false, 'error' => 'POST only']);

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) reply(400, ['ok' => false, 'error' => 'Invalid JSON']);

date_default_timezone_set('Asia/Kolkata');

try {
    $entry = save(clean($input));
    reply(200, ['ok' => true, 'id' => $entry['id']]);
} catch (Throwable $e) {
    reply(500, ['ok' => false, 'error' => 'Could not save']);
}
