class BasePage {
    constructor(page){
        this.page = page;
    }

    async clickAndType (selector, string) {
        try {
            const field = await this.page.$(selector);
            if (!field) throw new Error(`Element with selector ${selector} not found`);

            await field.click();
            await field.type(string);

        } catch (e) {
            throw new Error(`Error while click and type on ${selector}: ${e.message}`);
        }
    }
}

module.exports = BasePage;