const BasePage = require('./basePage');

class AddDealPage extends BasePage {
    constructor(page){
        super(page);
        this.selectors = {
            HEADER: '.addDealDialog header',
            PERSON_INPUT: 'input[name="person"]',
            ORG_INPUT: 'input[name="organization"]',
            TITLE_INPUT: 'input[name="title"]',
            DEAL_INPUT: 'input[name="value"]',
            DEAL_SELECT: 'div.currency input',
            PIPELINE_RADIOS: 'div.plainStages span',
            CLOSEDATE:'input[name="expected_close_date"]',
            OWNERSHIP_SELECT:'button[data-test="visible_to-label"]',
            SAVE_BUTTON:'button.add-deal',
            CLOSE_BUTTON:'a[href="#dialog/close"]',
            AUTOCOMPLETE_RESULT: 'li.search-message span'
        };
    }

    async typePerson(fullName) {
        await this.clickAndType(this.selectors.PERSON_INPUT, fullName);
    }

    async typeOrg(name) {
        await this.clickAndType(this.selectors.ORG_INPUT, name);
    }

    async typeTitle(title) {
        await this.clickAndType(this.selectors.TITLE_INPUT, title);
    }

    async getAutocompeteMessage() {
        try {
            await this.page.waitForSelector(this.selectors.AUTOCOMPLETE_RESULT, {visible: true, timeout: 3000});
            return await this.page.$eval(this.selectors.AUTOCOMPLETE_RESULT, e=>e.innerHTML);
        } catch (error) {
            return null;
        }        
    }

    async waitForHeader(){
        await this.page.waitForSelector(this.selectors.HEADER, {timeout:3000});
    }

    async submit() {
        await this.page.click(this.selectors.SAVE_BUTTON);
    }

}

module.exports = AddDealPage;