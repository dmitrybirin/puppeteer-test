const BasePage = require('./basePage');

class LoginPage extends BasePage {
    constructor(page){
        super(page);
        this.selectors = {
            LOGIN_INPUT: 'input[id="login"]',
            PASSWORD_INPUT: 'input[id="password"]',
            SUBMIT_BUTTON: 'button.submit-button'
        };
    }

    async inputLogin(email) {
        await this.clickAndType(this.selectors.LOGIN_INPUT, email);
    }

    async inputPassword(password) {
        await this.clickAndType(this.selectors.PASSWORD_INPUT, password);
    }

    async submit() {
        await this.page.click(this.selectors.SUBMIT_BUTTON);
    }

    async login(email, password) {
        await this.inputLogin(email);
        await this.inputPassword(password);
        await this.submit();
        await this.page.waitForNavigation({waitUntil: ['networkidle0', 'domcontentloaded']});
    }

}

module.exports = LoginPage;