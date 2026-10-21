const config = window.NAPCON_CONFIG

if (!config) throw new Error('config.js missing next to index.html (window.NAPCON_CONFIG not set)')

export default config
