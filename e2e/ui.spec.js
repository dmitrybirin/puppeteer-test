const puppeteer = require('puppeteer');
const faker = require('faker');

const { LoginPage, AddDealPage, PipeLinePage } = require('./pages/');
const { LOGIN_URL } = require('../urls');
const { EMAIL, PASSWORD } = require('../authData');

const TEST_TIMEOUT = process.env.NODE_ENV === 'debug' ? 20000 : 0;
const isDebugging = () => {
    let debugging_mode = {
        headless: false,
        slowMo: 15,
        devtools: true,
    };
    return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
};


let page;
let browser;
const po = {};

beforeAll(async () => {
    browser = await puppeteer.launch(isDebugging());
    page = await browser.newPage();
    await page.goto(LOGIN_URL);
    await new LoginPage(page).login(EMAIL, PASSWORD);
});

beforeEach(async () => {
    po.addDealDialog = new AddDealPage(page);
    po.pipelinePage = new PipeLinePage(page);
    await po.pipelinePage.openAddDealDialog();
    await po.addDealDialog.waitForDialog();
});

afterEach(async () => {
    await po.addDealDialog.closeDialogIfExist();
});


describe('Add deal e2e tests', () => {

    test('minimum flow', async () => {
        const deal = {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            org: faker.company.companyName(),
        };
        
        await po.addDealDialog.personInput.clickAndType(deal.name);
        await po.addDealDialog.orgInput.clickAndType(deal.org);
        await po.addDealDialog.submit();
        await po.addDealDialog.waitForDialogClosed();

        const pipeDataFirstStage = await po.pipelinePage.getDealsDataByStage(1);
        expect(pipeDataFirstStage).toContainEqual({
            org: deal.org,
            currency: '€',
            value: '0',
            title: `${deal.org} deal`
        });

    }, TEST_TIMEOUT);

    test('new person', async () => {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        await po.addDealDialog.personInput.clickAndType(name);
        expect(await po.addDealDialog.personInput.getAutocompeteMessage())
            .toEqual(`‘${name}’ will be added as a new contact`);

        await po.addDealDialog.personInput.clickAutocomplete();
        expect(await po.addDealDialog.personInput.isNewLabel())
            .toBeTruthy();

    }, TEST_TIMEOUT);


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
