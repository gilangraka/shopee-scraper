const { default: axiosInstance } = require("../Helpers/AxiosInstance");
const Helper = require("../Helpers/Helper");

class GetFirebaseOldestPendingData {
    constructor(page, config) {
        this.page = page;
        this.config = config;
    }

    async run() {
        try {
            const res = await axiosInstance.get('/get-oldest-ticket-request');
            const data = res.data.data;

            return data;
        } catch (error) {
            Helper.PrintErrorMsg(`Failed to get pending data: ${error.message}`);
            throw error;
        }
    }
}

module.exports = GetFirebaseOldestPendingData;