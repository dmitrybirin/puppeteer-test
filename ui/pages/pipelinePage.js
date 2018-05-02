const formatTitle = (html) => {
    const matches = html.match(/<img(.*)>(.*)/);
    return matches[2];
};

const getValueAndCurrency = (html) => {
    const matches = html.match(/(.*)&nbsp;(.)/);
    return ({
        value: matches[1].replace(/\./g, ''),
        currency: matches[2],
    });
};

const getHTMLbySelector = async (el, selector) => {
    const element = await el.$(selector);
    const handler = await element.getProperty('innerHTML');
    return handler.jsonValue();
};

class PipeLinePage {
    constructor(page){
        this.page = page;
        this.selectors = {
            DEALS_BY_STAGE: (stage) => `div.dealsTable div.stage[data-stage-id="${stage}"] li div.block`,
            ADD_DEAL_BUTTON: '[id="pipelineAddDeal"]'
        };
    }

    async getDealsDataByStage(stage){
        const stageBlocks = await this.page.$$(this.selectors.DEALS_BY_STAGE(stage));
        return Promise.all(stageBlocks.map(async el=> 
            ({
                ...getValueAndCurrency(await getHTMLbySelector(el, 'small span.value')),
                title: formatTitle(await getHTMLbySelector(el, 'strong')),
                org: await getHTMLbySelector(el, 'small span.org')
            })
        ));
    }

    async gatherData(){
        return await Promise.all([1,2,3,4,5].map(async stage => await this.getDealsDataByStage(stage)));
    }

    async openAddDealDialog() {
        const button = await this.page.$(this.selectors.ADD_DEAL_BUTTON);
        await button.click();
    }

}

module.exports = PipeLinePage;