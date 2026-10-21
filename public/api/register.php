<?php

const DATA_DIR = __DIR__ . '/data';
const COLUMNS = ['id' => 'ID', 'name' => 'Name', 'phone' => 'Phone', 'game' => 'Game', 'registeredAt' => 'Registered At', 'savedAt' => 'Saved At'];

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
    if (!preg_match('/^[a-z0-9-]{1,30}$/', $game)) $errors['game'] = 'Invalid game';
    if ($at !== '' && strtotime($at) === false) $errors['registeredAt'] = 'Invalid date';
    if ($errors) reply(400, ['ok' => false, 'errors' => $errors]);

    return ['name' => $name, 'phone' => $phone, 'game' => $game, 'registeredAt' => $at];
}

function xml(string $s): string
{
    return htmlspecialchars($s, ENT_XML1 | ENT_QUOTES, 'UTF-8');
}

function cellRef(int $col, int $row): string
{
    return chr(65 + $col) . $row;
}

function writeXlsx(string $path, array $rows): void
{
    $sheetRows = '';
    foreach (array_merge([array_values(COLUMNS)], array_map(fn($r) => array_map(fn($k) => (string)$r[$k], array_keys(COLUMNS)), $rows)) as $i => $values) {
        $cells = '';
        foreach ($values as $c => $v) {
            $style = $i === 0 ? ' s="1"' : '';
            $cells .= '<c r="' . cellRef($c, $i + 1) . '" t="inlineStr"' . $style . '><is><t>' . xml($v) . '</t></is></c>';
        }
        $sheetRows .= '<row r="' . ($i + 1) . '">' . $cells . '</row>';
    }

    $widths = [8, 28, 16, 12, 28, 22];
    $cols = '';
    foreach ($widths as $c => $w) $cols .= '<col min="' . ($c + 1) . '" max="' . ($c + 1) . '" width="' . $w . '" customWidth="1"/>';

    $files = [
        '[Content_Types].xml' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
        '_rels/.rels' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
        'xl/workbook.xml' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Registrations" sheetId="1" r:id="rId1"/></sheets></workbook>',
        'xl/_rels/workbook.xml.rels' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
        'xl/styles.xml' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>',
        'xl/worksheets/sheet1.xml' => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>' . $cols . '</cols><sheetData>' . $sheetRows . '</sheetData></worksheet>',
    ];

    $tmp = $path . '.tmp';
    $zip = new ZipArchive();
    if ($zip->open($tmp, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) throw new RuntimeException('Cannot write xlsx');
    foreach ($files as $name => $content) $zip->addFromString($name, $content);
    $zip->close();
    rename($tmp, $path);
}

function save(array $entry): array
{
    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0775, true)) throw new RuntimeException('Cannot create data folder');

    $lock = fopen(DATA_DIR . '/.lock', 'c');
    flock($lock, LOCK_EX);
    try {
        $jsonPath = DATA_DIR . '/registrations.json';
        $rows = is_file($jsonPath) ? (json_decode(file_get_contents($jsonPath), true) ?: []) : [];

        $entry = ['id' => count($rows) + 1] + $entry + ['savedAt' => date('Y-m-d H:i:s')];
        $rows[] = $entry;

        file_put_contents($jsonPath . '.tmp', json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        rename($jsonPath . '.tmp', $jsonPath);

        $csvPath = DATA_DIR . '/registrations.csv';
        $isNew = !is_file($csvPath);
        $csv = fopen($csvPath, 'a');
        if ($isNew) {
            fwrite($csv, "\xEF\xBB\xBF");
            fputcsv($csv, array_values(COLUMNS));
        }
        fputcsv($csv, array_map(fn($k) => $entry[$k], array_keys(COLUMNS)));
        fclose($csv);

        if (class_exists('ZipArchive')) writeXlsx(DATA_DIR . '/registrations.xlsx', $rows);

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
