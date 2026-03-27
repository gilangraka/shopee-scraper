const Helper = require("../Helpers/Helper");

class GetFirebaseOldestPendingData {
    constructor(page) {
        this.page = page;
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