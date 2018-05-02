# Pipedrive test

## Description

1. Create automated API and UI tests for “Add deal” feature in Pipedrive using JavaScript based testing framework.
2. The amount and scope of the tests is up to you to decide, just report how much time did you use to solve the task.

## Implementation
I focused on UI tests and have little time, so no pure API tests there.
I tried to describe all decisions in the FAQ
The UI tests devided by e2e and component/module tests.
- e2e tests: two tests, demonstrated different approaches. One only UI, the second - with help of API.
- various component tests: quick incapsulated tests

## Installation
```
yarn
```

## How to run

### headless mode
```
yarn ui
```

### to watch what's going on
```
yarn ui:debug
```

## Checklist
- [x] Create Readme. That was easy:)
- [x] Choose UI framework -> Puppeteer
- [x] API framework -> https://www.frisbyjs.com/
- [x] Get access/docs to API -> https://developers.pipedrive.com/docs/api/v1/
- [x] Init frameworks (Puppeteer)
- [x] Lint
- [x] Write e2e tests
- [x] Automate test cases
- [x] Add how to run tests in Readme
- [ ] Improve test coverage
- [ ] API tests
- [ ] Improve Autocomplete tests to be able to choose not only first option
- [ ] Check spinners
- [ ] Currency tests
- [ ] DatePicker tests
- [ ] Select currency and input elements are very similar. Get rid of select.
- [ ] Create FAQ (Why puppeteer, pros and cons, why I did that, not that)