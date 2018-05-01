const puppeteer = require('puppeteer')

class LoginPage {
    constructor(page){
        this.page = page
        this.selectors = {
            LOGIN_INPUT: 'input[id="login"]',
            PASSWORD_INPUT: 'input[id="password"]',
            SUBMIT_BUTTON: 'button.submit-button'
        }
    }

    async inputLogin(email) {
        const loginField = await this.page.$(this.selectors.LOGIN_INPUT)
        await loginField.click()
        await loginField.type(email)
    }

    async inputPassword(password) {
        const passwordField = await this.page.$(this.selectors.PASSWORD_INPUT)
        await passwordField.click()
        await passwordField.type(password)
    }

    async submit() {
        await this.page.click(this.selectors.SUBMIT_BUTTON)
    }

    async login(email, password) {
        await this.inputLogin(email)
        await this.inputPassword(password)
        await this.submit()
        await this.page.waitForNavigation({waitUntil: "networkidle0"})
    }

}

module.exports = LoginPage