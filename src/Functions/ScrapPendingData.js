const Helper = require("../Helpers/Helper");

class ScrapPendingData {
    constructor(page) {
        this.page = page;
    }

    static async run(pendingData) {
        try {

        } catch (error) {
            Helper.PrintErrorMsg(`Failed to scrap pending data: ${error.message}`);
            throw error;
        }
    }
}

module.exports = ScrapPendingData;