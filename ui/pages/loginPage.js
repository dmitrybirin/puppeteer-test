const Input = require('../components/input');

class LoginPage {
    constructor(page){
        this.page = page;
        this.loginInput = new Input(page, 'input[id="login"]');
        this.passInput = new Input(page, 'input[id="password"]');
        this.selectors = {
            SUBMIT_BUTTON: 'button.submit-button'
        };
    }

    async submit() {
        await this.page.click(this.selectors.SUBMIT_BUTTON);
        await this.page.waitForNavigation({waitUntil: ['networkidle0', 'domcontentloaded']});
    }

    async login(email, password) {
        await this.loginInput.clickAndType(email);
        await this.passInput.clickAndType(password);
        await this.submit();
    }

}

module.exports = LoginPage;