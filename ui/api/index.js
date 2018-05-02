// I know there is https://github.com/pipedrive/client-nodejs, but I just hate callbacks

const fetch = require('node-fetch');
const { API_ENDPOINT } = require('../../urls');
const { API_TOKEN } = require('../../authData');

const url = (resourse) => `${API_ENDPOINT}/${resourse}?api_token=${API_TOKEN}`;

const responseHandler = async (response) => {
    if (!response.ok) throw new Error(`Response is not OK: ${response.status}`);
    else {
        const data = await response.json();
        return data;
    } 
};

const pipeRequest = {
    get: async (resourse) => await responseHandler(await fetch(url(resourse))),
    post: async (resourse, data) => await responseHandler(await fetch(url(resourse), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })),
    bulkDelete: async (resourse, ids) => await responseHandler(await fetch(`${url(resourse)}&ids=${encodeURIComponent(ids.join(','))}`, {
        method: 'DELETE'
    })),
};

const createPerson = async (name) => pipeRequest.post('persons', {name});
const createOrg = async (name) => pipeRequest.post('organizations', {name});

const getDeals = async () => pipeRequest.get('deals');
const getOrgs = async () => pipeRequest.get('organizations');
const getPersons = async () => pipeRequest.get('persons');
const deleteAll = async () => {
    const deals = await getDeals();
    const orgs = await getOrgs();
    const persons = await getPersons();
    await Promise.all([
        deals.data ? await pipeRequest.bulkDelete('deals', deals.data.map(d=>d.id)) : null,
        orgs.data ? await pipeRequest.bulkDelete('organizations', orgs.data.map(d=>d.id)) : null,
        persons.data ? await pipeRequest.bulkDelete('persons', persons.data.map(d=>d.id)) : null,
    ]);
    
};

module.exports = {
    createPerson,
    createOrg,
    getDeals,
    getOrgs,
    getPersons,
    deleteAll,
};