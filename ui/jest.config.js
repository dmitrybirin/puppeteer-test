module.exports = {
    testRegex: '.(test|spec)\\.(js)$',
    testPathIgnorePatterns: ['/api/', '/node_modules/'],
    setupTestFrameworkScriptFile : './jest/init.js',
    globalSetup: './jest/setup.js',
    globalTeardown: './jest/teardown.js',
    testEnvironment: './jest/puppeteerEnvironment.js',
};