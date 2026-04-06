const Helper = require("../Helpers/Helper");

class GetFirebaseOldestPendingData {
    constructor(page, config) {
        this.page = page;
        this.config = config;
    }

    async run() {
        try {
            
        } catch (error) {
            Helper.PrintErrorMsg(`Failed to get pending data: ${error.message}`);
            throw error;
        }
    }
}

module.exports = GetFirebaseOldestPendingData;