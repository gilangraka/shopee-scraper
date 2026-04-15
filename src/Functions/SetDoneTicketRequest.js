const { default: axiosInstance } = require("../Helpers/AxiosInstance");
const Helper = require("../Helpers/Helper");

class SetDoneTicketRequest {
    constructor(page, config, ticketId, storedData) {
        this.page = page;
        this.config = config;
        this.ticketId = ticketId;
        this.storedData = storedData;
    }

    async run() {
        try {
        } catch (error) {
            Helper.PrintErrorMsg(`Failed to set done ticket request: ${error.message}`);
            throw error;
        }
    }
}

module.exports = SetDoneTicketRequest;