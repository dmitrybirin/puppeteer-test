const puppeteer = require('puppeteer');
const faker = require('faker');

const { LoginPage, AddDealPage } = require('./pages/');
const { LOGIN_URL } = require('../urls');
const { EMAIL, PASSWORD } = require('../authData');

const TEST_TIMEOUT = process.env.NODE_ENV === 'debug' ? 10000 : 0;
const isDebugging = () => {
    let debugging_mode = {
        headless: false,
        slowMo: 30,
        devtools: true,
    };
    return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
};

let browser; 
let page;
beforeAll(async () => {
    browser = await puppeteer.launch(isDebugging());
    page = await browser.newPage();
    await page.goto(LOGIN_URL);
    await new LoginPage(page).login(EMAIL, PASSWORD);
    const button = await page.$('[id="pipelineAddDeal"]');
    await button.click();
});

describe('Happy path tests', () => {

    test('new person', async () => {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        const addDealPage = new AddDealPage(page);
        await addDealPage.waitForHeader();
        await addDealPage.typePerson(name);
        const message = await addDealPage.getAutocompeteMessage();
        expect(message).toEqual(`‘${name}’ will be added as a new contact`);

    }, TEST_TIMEOUT);


// test(' is log in', async () => {
//     const buttonText = await page.$eval('[id="pipelineAddDeal"]', e => e.text);
//     expect(buttonText.trim()).toBe('Add deal');
// }, TEST_TIMEOUT);
//  Existing/non-existing person
// Existing/non-existing organisation
// Title
// Value number
// Value currency (investigate currency tests)
// Stage (investigate different stages in the app)
// Close date (Calendar, Berlin airport - strange stuff)
// Ownership
// Errors


});

afterAll(() => {
    if (isDebugging()) {
        browser.close();
    }
});
