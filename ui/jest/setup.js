const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

const isDebugging = () => {
    let debugging_mode = {
        headless: false,
        slowMo: 30,
        devtools: true,
    };
    return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
};

module.exports = async function() {
    const browser = await puppeteer.launch(isDebugging());

    global.__BROWSER__ = browser;
    global.__TEST_TIMEOUT__ = process.env.NODE_ENV === 'debug' ? 40000 : 0;

    mkdirp.sync(DIR);
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};