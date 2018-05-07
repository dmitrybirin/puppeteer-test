const faker = require('faker');

const { AddDealPage, PipeLinePage } = require('./pages/');
const { login } = require('./scenarios');
const api = require('./api');
const { sleep } = require('./helpers');

let page;
const pageObjects = {};

beforeAll(async () => {
    page = await global.__BROWSER__.newPage();
    await login(page);
});

beforeEach(async () => {
    pageObjects.addDealDialog = new AddDealPage(page);
    pageObjects.pipelinePage = new PipeLinePage(page);
    // await sleep(5000);
    await pageObjects.pipelinePage.openAddDealDialog();
    await pageObjects.addDealDialog.waitForDialog();
});

afterEach(async () => {
    await pageObjects.addDealDialog.closeDialogIfExist();
});


describe('person tests', async () => {

    test('existing person', async () => {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        await api.createPerson(name);
        //additional wait for data on server
        await sleep(500);
        await pageObjects.addDealDialog.personInput.clickAndType(name.slice(0,-3));
        expect(await pageObjects.addDealDialog.personInput.getAutocompeteMessage()).toBe(name);

        await pageObjects.addDealDialog.personInput.chooseAutocompleteOption(name);
        expect(await pageObjects.addDealDialog.personInput.isNewLabel()).toBe(false);
        expect(await pageObjects.addDealDialog.titleInput.getValue()).toBe(`${name} deal`);

    }, global.TEST_TIMEOUT);

    test('new person', async () => {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        await pageObjects.addDealDialog.personInput.clickAndType(name);
        const message = await pageObjects.addDealDialog.personInput.getAutocompeteMessage();

        expect(message)
            .toEqual(`‘${name}’ will be added as a new contact`);

        await pageObjects.addDealDialog.personInput.clickAutocomplete();
        expect(await pageObjects.addDealDialog.personInput.isNewLabel()).toBe(true);

    }, global.TEST_TIMEOUT);

});