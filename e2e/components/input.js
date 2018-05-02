class Input {
    
    constructor(page, selector){
        this.page = page;
        this.selectors = {
            SELF: selector,
            AUTOCOMPLETE_RESULT: '[id="widget-ac-results"] li span',
            NEW_LABEL: `${selector} ~ span.badge`,
        };
    }

    async clear(){
        await this.page.evaluate(`document.querySelector('${this.selectors.SELF}').value = ''`);
    }

    async clickAndType(string) {
        try {
            await this.clear();
            await this.page.waitForSelector(this.selectors.SELF, {visible: true});
            const field = await this.page.$(this.selectors.SELF);
            if (!field) throw new Error(`Element with selector ${this.selectors.SELF} not found`);

            await field.click();
            await field.type(string);

        } catch (e) {
            throw new Error(`Error while click and type on ${this.selectors.SELF}: ${e.message}`);
        }
    }

    async getValue() {
        const element = await this.page.$(this.selectors.SELF);
        getValue(element);
    }

    async getAutocompeteMessage() {
        try {
            const ar = this.selectors.AUTOCOMPLETE_RESULT;
            await this.page.waitForSelector(ar, {visible: true});
            return await this.page.$eval(ar, e=>e.innerHTML);
        } catch (error) {
            return null;
        }        
    }

    async chooseAutocompleteOption(text) {
        const ar = this.selectors.AUTOCOMPLETE_RESULT;
        await this.page.waitForSelector(ar, {visible: true});
        const options = await this.page.$$(ar);
        const filteredOptions = await Promise.all(
            options.filter(async (option) => await getValue(option) === text));
        await filteredOptions[0].click();
    }

    async clickAutocomplete() {
        const ar = this.selectors.AUTOCOMPLETE_RESULT;
        await this.page.waitForSelector(ar, {visible: true});
        await this.page.click(ar);
    }

    async isNewLabel() {
        return !!(await this.page.$(this.selectors.NEW_LABEL));
    }
}

module.exports = Input;

const getValue = async (element) => {
    const elementHandle = await element.getProperty('value');
    return elementHandle.jsonValue();
};