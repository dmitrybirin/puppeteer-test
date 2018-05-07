
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/* This resolves an issue where puppeteer cannot interact with the page yet because
a context is not defined. This is usually related to navigation.
See also: https://github.com/GoogleChrome/puppeteer/issues/1325
*/

// const waitForNavigationAndContext = (page, timeout = 100, overallTimeout = 10000) => promiseRetry(async (retry) => {
//     try {
//         await promiseRetry(async (retryChecking) => {
//             if (document.readyState === 'complete') {
//                 resolve();
//             }
//             else {
//                 retryChecking();
//             }
//         })
//     } catch (err) {
//         if (err.message.includes('Cannot find context with specified id undefined')) {
//             retry();
//         } else {
//             throw err;
//         }
//     }
// }, { retries: Math.ceil(overallTimeout / timeout), minTimeout: timeout, overallTimeout: timeout });


module.exports = {
    sleep,
};