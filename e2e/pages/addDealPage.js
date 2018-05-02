const Input = require('../components/input');

class AddDealPage {
    constructor(page){
        this.page = page;
        this.personInput = new Input(page, 'input[name="person"]');
        this.orgInput = new Input(page, 'input[name="organization"]');
        this.titleInput = new Input(page, 'input[name="title"]');
        this.dealInput = new Input(page, 'input[name="value"]');
        this.selectors = {
            HEADER: '.addDealDialog header',
            DEAL_SELECT: 'div.currency input',
            PIPELINE_RADIOS: 'div.plainStages span',
            CLOSEDATE:'input[name="expected_close_date"]',
            OWNERSHIP_SELECT:'button[data-test="visible_to-label"]',
            SAVE_BUTTON:'button.add-deal',
            CLOSE_BUTTON:'a[href="#dialog/close"]',
        };
    }

    async waitForHeader(){
        await this.page.waitForSelector(this.selectors.HEADER, {timeout:3000});
    }

    async submit() {
        await this.page.click(this.selectors.SAVE_BUTTON);
    }

}

module.exports = AddDealPage;