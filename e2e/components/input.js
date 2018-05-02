class Input {
    
    constructor(page, selector){
        this.page = page;
        this.selectors = {
            SELF: selector,
            AUTOCOMPLETE_RESULT: 'li.search-message span',
            NEW_LABEL: `${selector} ~ span.badge`,
        };
    }

    async clickAndType (string) {
        try {
            await this.page.waitForSelector(this.selectors.SELF, {visible: true});
            const field = await this.page.$(this.selectors.SELF);
            if (!field) throw new Error(`Element with selector ${this.selectors.SELF} not found`);

            await field.click();
            await field.type(string);

        } catch (e) {
            throw new Error(`Error while click and type on ${this.selectors.SELF}: ${e.message}`);
        }
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