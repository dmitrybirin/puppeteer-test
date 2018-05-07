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
            await this.page.waitForSelector(this.selectors.SELF, {visible: true});
            await this.clear();
            const field = await this.page.$(this.selectors.SELF);
            if (!field) throw new Error(`Element with selector ${this.selectors.SELF} not found`);

            await field.click();
            await field.type(string, {delay: 20});

        } catch (e) {
            throw new Error(`Error while click and type on ${this.selectors.SELF}: ${e.message}`);
        }
    }

    async getValue() {
        const element = await this.page.$(this.selectors.SELF);
        return getValueFromElement(element);
    }

    async getAutocompeteMessage() {
        const ar = this.selectors.AUTOCOMPLETE_RESULT;
        await this.page.waitForSelector(ar, {visible: true, timeout: 10000});
        return await this.page.$eval(ar, e=>e.innerHTML);
    }

    async chooseAutocompleteOption(text) {
        const ar = this.selectors.AUTOCOMPLETE_RESULT;
        await this.page.waitForSelector(ar, {visible: true});
        const options = await this.page.$$(ar);
        const filteredOptions = await Promise.all(
            options.filter(async (option) => await getValueFromElement(option) === text));
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

const getValueFromElement = async (element) => {
    const elementHandle = await element.getProperty('value');
    return elementHandle.jsonValue();
};