const puppeteer = require('puppeteer');
const faker = require('faker');
const shortid = require('shortid');

const { LoginPage, AddDealPage, PipeLinePage } = require('./pages/');
const { LOGIN_URL } = require('../urls');
const { EMAIL, PASSWORD } = require('../authData');
const api = require('./api');

const TEST_TIMEOUT = process.env.NODE_ENV === 'debug' ? 40000 : 0;
const isDebugging = () => {
    let debugging_mode = {
        headless: false,
        slowMo: 100,
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

    test('minimum flow without API calls', async () => {
        const deal = {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            org: `${faker.company.companyName()} ${shortid.generate()}`,
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

    test('all fields flow, using API calls', async () => {
        const deal = {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            org: `${faker.company.companyName()}`,
            title: `Test deal ${shortid.generate()}`,
            value: faker.random.number(1000000).toString(),
            currency: 'XBT',
            closeDate: faker.date.future().toLocaleDateString('ru-RU'),
            status: 'open',
            stage: 3,
        };

        await api.createPerson(deal.name);
        await api.createOrg(deal.org);
        
        await po.addDealDialog.personInput.clickAndType(deal.name);
        await po.addDealDialog.personInput.chooseAutocompleteOption(deal.name);

        await po.addDealDialog.orgInput.clickAndType(deal.org);
        await po.addDealDialog.orgInput.chooseAutocompleteOption(deal.org);

        await po.addDealDialog.titleInput.clickAndType(deal.title);
        await po.addDealDialog.valueInput.clickAndType(deal.value);
        await po.addDealDialog.currencySelect.chooseByTyping(deal.currency);
        await po.addDealDialog.chooseStage(deal.stage);
        await po.addDealDialog.dateInput.clickAndType(deal.closeDate);

        await po.addDealDialog.submit();
        await po.addDealDialog.waitForDialogClosed();

        const deals = await api.getDeals();
        const createdDeal = deals.data.filter(d => d.title === deal.title)[0];
        expect(createdDeal).toBeTruthy();
        
        const mapped = {
            name: createdDeal.person_name,
            org: createdDeal.org_name,
            title: createdDeal.title,
            value: createdDeal.value.toString(),
            currency: createdDeal.currency,
            closeDate: new Date(createdDeal.expected_close_date).toLocaleDateString('ru-RU'),
            status: createdDeal.status,
            stage: createdDeal.stage_order_nr,
        };

        expect(mapped).toEqual(deal);

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

describe('person tests', async () => {
    test('new person', async () => {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        await po.addDealDialog.personInput.clickAndType(name);
        expect(await po.addDealDialog.personInput.getAutocompeteMessage())
            .toEqual(`‘${name}’ will be added as a new contact`);

        await po.addDealDialog.personInput.clickAutocomplete();
        expect(await po.addDealDialog.personInput.isNewLabel())
            .toBeTruthy();

    }, TEST_TIMEOUT);

    test('existing person', async () => {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        await api.createPerson(name);
        await po.addDealDialog.personInput.clickAndType(name.slice(0,-3));
        expect(await po.addDealDialog.personInput.getAutocompeteMessage()).toBe(name);

        await po.addDealDialog.personInput.chooseAutocompleteOption(name);
        expect(await po.addDealDialog.personInput.isNewLabel()).toBeFalsy();
        expect(await po.addDealDialog.titleInput.getValue()).toBe(`${name} deal`);

    }, TEST_TIMEOUT);
});

afterAll(() => {
    if (isDebugging()) {
        browser.close();
    }
});
