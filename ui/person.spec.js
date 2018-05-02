const faker = require('faker');

const { LoginPage, AddDealPage, PipeLinePage } = require('./pages/');
const { PIPE_URL } = require('../urls');
const { EMAIL, PASSWORD } = require('../authData');
const api = require('./api');
const { sleep } = require('./helpers');

describe('person tests', () => {

    let page;
    const po = {};
    
    beforeAll(async () => {
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

    test('existing person', async () => {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        await api.createPerson(name);
        await sleep(500);
        await po.addDealDialog.personInput.clickAndType(name.slice(0,-3));
        expect(await po.addDealDialog.personInput.getAutocompeteMessage()).toBe(name);

        await po.addDealDialog.personInput.chooseAutocompleteOption(name);
        expect(await po.addDealDialog.personInput.isNewLabel()).toBe(false);
        expect(await po.addDealDialog.titleInput.getValue()).toBe(`${name} deal`);

    }, global.TEST_TIMEOUT);

    test('new person', async () => {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        await po.addDealDialog.personInput.clickAndType(name);
        
        expect(await po.addDealDialog.personInput.getAutocompeteMessage())
            .toEqual(`‘${name}’ will be added as a new contact`);

        await po.addDealDialog.personInput.clickAutocomplete();
        expect(await po.addDealDialog.personInput.isNewLabel()).toBe(true);

    }, global.TEST_TIMEOUT);

});