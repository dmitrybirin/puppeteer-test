const faker = require('faker');
const moment = require('moment');
const shortid = require('shortid');

const { AddDealPage, PipeLinePage } = require('./pages/');
const { login } = require('./scenarios');
const api = require('./api');

let page;
const pageObjects = {};

beforeAll(async () => {
    page = await global.__BROWSER__.newPage();
    await login(page);
});

beforeEach(async () => {
    pageObjects.addDealDialog = new AddDealPage(page);
    pageObjects.pipelinePage = new PipeLinePage(page);
    await pageObjects.pipelinePage.openAddDealDialog();
    await pageObjects.addDealDialog.waitForDialog();
});

afterEach(async () => {
    await pageObjects.addDealDialog.closeDialogIfExist();
});

describe('Add deal e2e tests', () => {

    test('minimum flow without API calls', async () => {
        const deal = {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            org: `${faker.company.companyName()} ${shortid.generate()}`,
        };
        
        await pageObjects.addDealDialog.personInput.clickAndType(deal.name);
        await pageObjects.addDealDialog.orgInput.clickAndType(deal.org);
        await pageObjects.addDealDialog.submit();
        await pageObjects.addDealDialog.waitForDialogClosed();

        const pipeDataFirstStage = await pageObjects.pipelinePage.getDealsDataByStage(1);
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
        
        await pageObjects.addDealDialog.personInput.clickAndType(deal.name);
        await pageObjects.addDealDialog.personInput.chooseAutocompleteOption(deal.name);

        await pageObjects.addDealDialog.orgInput.clickAndType(deal.org);
        await pageObjects.addDealDialog.orgInput.chooseAutocompleteOption(deal.org);

        await pageObjects.addDealDialog.titleInput.clickAndType(deal.title);
        await pageObjects.addDealDialog.valueInput.clickAndType(deal.value);
        await pageObjects.addDealDialog.currencySelect.chooseByTyping(deal.currency);
        await pageObjects.addDealDialog.chooseStage(deal.stage);
        await pageObjects.addDealDialog.dateInput.clickAndType(deal.closeDate);

        await pageObjects.addDealDialog.submit();
        await pageObjects.addDealDialog.waitForDialogClosed();

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