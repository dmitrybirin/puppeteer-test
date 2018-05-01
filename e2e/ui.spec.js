const puppeteer = require('puppeteer')

const LoginPage  = require('./pages/loginPage')
const { LOGIN_URL } = require('../urls')
const { EMAIL, PASSWORD } = require('../authData')

const isDebugging = () => {
  let debugging_mode = {
    headless: false,
    slowMo: 100,
    devtools: true
  }
  return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
}

let browser
let page
beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging())
  page = await browser.newPage()
  await page.goto(LOGIN_URL)
  await new LoginPage(page).login(EMAIL, PASSWORD)
})

//Init test
describe('on page load ', () => {
  test('text is log in', async () => {

    const buttonText = await page.$eval('[id="pipelineAddDeal"]', e => e.text)
    expect(buttonText.trim()).toBe('Add deal')

  }, 15000)

})


afterAll(() => {
  if (isDebugging()) {
    browser.close()
  }
})