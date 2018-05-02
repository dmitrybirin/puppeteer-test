Q: Why Puppeteer?
A: I used Webdriver for a long time, wanted to try something new.
It has kill features: request intercepting, speed, good API
There are couple of cons, though:
- only chromium
- some of the features broken (as for WaitForNavigation)
- hard to successfully maintain async behavior (aka sleep)

Q: Why all jest and puppeteer in dependencies, not devDependencies
A: If the source code of the app would be in the same monorepo as tests, then more logic will be in putting it in dev deps, but in this particular case, project - is a test project, so I decided put all dev stuff in deps (plus I've got lint and stuff).

Q: Why there is no login page tests at all?
A: The task goal is to test "Add deals" feature, therefore, as prerequisite we need to be at main screen to begin our tests.

Q: Why navigate trought login/pass. Maybe mock the login process?
A: It's a good idea, speeding the tests. But...
 - I don't really need speed tests there
 - I'd like e2e to be more closer to user
 - It's time consuming to implement it

Q: Why urls separate from authdata?
AuthData has sensitive information and ignored in my git, good habit.

Q: Why good old require, not imports and babel?
A: I thought of flow and babel firstly, but I decided to save time and make things a little simplier

Q: Why Page Object Model?
A: Well, it's good approach to separate components with same logic, but it's not silver bullet.