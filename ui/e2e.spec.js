const faker = require('faker');
const moment = require('moment');
const shortid = require('shortid');

const { LoginPage, AddDealPage, PipeLinePage } = require('./pages/');
const { PIPE_URL } = require('../urls');
const { EMAIL, PASSWORD } = require('../authData');
const api = require('./api');

let page;
const po = {};

beforeAll(async () => {
    await api.deleteAll();
    page = await global.__BROWSER__.newPage();
    await page.goto(PIPE_URL);
    if (await page.$('h1.auth-title')) await new LoginPage(page).login(EMAIL, PASSWORD);
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

    }, global.TEST_TIMEOUT);

    test('all fields flow, using API calls', async () => {
        const deal = {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            org: `${faker.company.companyName()}`,
            title: `Test deal ${shortid.generate()}`,
            value: faker.random.number(1000000).toString(),
            currency: 'XBT',
            closeDate: moment(faker.date.future()).format('DD.MM.YY'),
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

        const mapped = {
            name: createdDeal.person_name,
            org: createdDeal.org_name,
            title: createdDeal.title,
            value: createdDeal.value.toString(),
            currency: createdDeal.currency,
            closeDate: moment(createdDeal.expected_close_date).format('DD.MM.YY'),
            status: createdDeal.status,
            stage: createdDeal.stage_order_nr,
        };

        expect(mapped).toEqual(deal);

    }, global.TEST_TIMEOUT);

});