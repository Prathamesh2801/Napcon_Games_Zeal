// Settings live in public/config.js (dist/config.js after a build), loaded by index.html before the app,
// so they can be edited on the kiosk without rebuilding.
const config = window.NAPCON_CONFIG

if (!config) throw new Error('config.js missing next to index.html (window.NAPCON_CONFIG not set)')

export default config
