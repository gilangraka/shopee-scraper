const Helper = require("../Helpers/Helper");

class GetFirebaseOldestPendingData {
    constructor(page) {
        this.page = page;
    }

    async run() {
        try {
            
            const data = {
                ticket_id: 'example-ticket-123',
                data: ['Baju flannel biru', 'Celana chinos hitam']
            };

            return data;
        } catch (error) {
            Helper.PrintErrorMsg(`Failed to get pending data: ${error.message}`);
            throw error;
        }
    }
}

module.exports = GetFirebaseOldestPendingData;