const { PIPE_URL } = require('../../urls');
const { LoginPage } = require('../pages/');
const { EMAIL, PASSWORD } = require('../../authData');

const login = async (page) => {
    await page.goto(PIPE_URL);
    if (await page.$('h1.auth-title')) await new LoginPage(page).login(EMAIL, PASSWORD);
};

module.exports = {
    login,
};

    