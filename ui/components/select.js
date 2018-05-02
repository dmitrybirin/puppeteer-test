const Input = require('./input');

class Select {
    
    constructor(page, selector){
        this.page = page;
        this.input = new Input(page, '.select2-input');
        this.selectors = {
            SELF: selector,
            RESULTS: 'ul.select2-results li',
        };
    }

    async chooseByTyping(string) {
        const select = await this.page.$(this.selectors.SELF);
        await select.click();
        await this.input.clickAndType(string);
        const items = await this.page.$$(this.selectors.RESULTS);
        await items[0].click();
    }
}

module.exports = Select;