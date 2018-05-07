const Input = require('../components/input');
const Select = require('../components/select');

class AddDealPage {
    constructor(page){
        this.page = page;
        this.personInput = new Input(page, 'input[name="person"]');
        this.orgInput = new Input(page, 'input[name="organization"]');
        this.titleInput = new Input(page, 'input[name="title"]');
        this.valueInput = new Input(page, 'input[name="value"]');
        this.currencySelect = new Select(page, 'div.currency input');
        this.dateInput = new Input(page, 'input[name="expected_close_date"]');
        this.selectors = {
            DIALOG: '.addDealDialog',
            PIPELINE_OPTIONS: 'span.options label',
            OWNERSHIP_SELECT:'button[data-test="visible_to-label"]',
            SAVE_BUTTON:'button.add-deal',
            CLOSE_BUTTON:'a[href="#dialog/close"]',
        };
    }

    async chooseStage(number){
        if (![1,2,3,4,5].includes(number)) throw new Error('Stage only can be in [1-5] format');
        const options = await this.page.$$(this.selectors.PIPELINE_OPTIONS);
        await options[number-1].click();
    }

    async waitForDialog(){
        const checkForExist = () => document.querySelector('.addDealDialog');
        await this.page.waitForFunction(checkForExist, {polling: 'mutation'});
    }

    async waitForDialogClosed(){
        const checkForNotExist = () => !document.querySelector('.addDealDialog');
        await this.page.waitForFunction(checkForNotExist, {polling: 'mutation'});
    }

    async submit() {
        await this.page.click(this.selectors.SAVE_BUTTON);
    }

    async closeDialogIfExist() {
        if (await this.page.$(this.selectors.CLOSE_BUTTON)) await this.page.click(this.selectors.CLOSE_BUTTON);
    }

}

module.exports = AddDealPage;