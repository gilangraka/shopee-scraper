const Helper = require("../Helpers/Helper");

class ScrapPendingData {
    constructor(page, config) {
        this.page = page;
        this.config = config;
    }

    async run(pendingData) {
        try {

        } catch (error) {
            Helper.PrintErrorMsg(`Failed to scrap pending data: ${error.message}`);
            throw error;
        }
    }
}

module.exports = ScrapPendingData;