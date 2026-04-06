const Helper = require("../Helpers/Helper");

class ToDashboard {
    constructor(page, config) {
        this.page = page;
        this.config = config;
    }

    async run() {
        try {
            try {
                await Helper.SafeAction(this.page, "input[role='combobox']", "wait", { description: "Search form" });
                Helper.PrintMsg("Already logged in, proceeding to check pending data...");
                return;
            } catch (error) {
                Helper.PrintMsg("Not logged in yet, proceeding to login...");
            }

            try {
                Helper.PrintMsg("Checking language selection...");
                await Helper.SafeAction(
                    this.page,
                    this.page.getByRole('button', { name: 'Bahasa Indonesia' }),
                    'click',
                    { description: "Selecting language" }
                );
            } catch (error) {
                Helper.PrintMsg("Language selection not found, maybe already selected. Skipping language selection...");
            }

            try {
                Helper.PrintMsg("Checking Login Form...");
                await Helper.SafeAction(this.page, this.page.getByRole('textbox', { name: 'No. Handphone/Username/Email' }), "type", {
                    value: this.config.loginId,
                    description: "Login ID"
                });
                await Helper.SafeAction(this.page, this.page.getByRole('textbox', { name: 'Password' }), "type", {
                    value: this.config.loginPassword,
                    description: "Password"
                });
                await Promise.all([
                    this.page.waitForNavigation({ waitUntil: 'load' }),
                    Helper.SafeAction(this.page, this.page.getByRole('button', { name: 'Log In' }), "click", {
                        description: "Button login"
                    })
                ]);

                try {
                    Helper.PrintMsg("Checking PIN Input...");
                    await Promise.all([
                        this.page.waitForNavigation({ waitUntil: 'load' }),
                        await Helper.SafeAction(this.page, this.page.getByRole('button', { name: 'Verifikasi dengan PIN ShopeePay' }), "click", { description: "Button PIN verification" })
                    ]);
                    await Helper.Delay(1);

                    await this.page.keyboard.type(this.config.loginPin);
                    await Helper.Delay(1);

                    await Promise.all([
                        this.page.waitForNavigation({ waitUntil: 'load' }),
                        await Helper.SafeAction(this.page, this.page.getByRole('button', { name: 'OK' }), "click", { description: "Button OK" })
                    ]);
                } catch (error) {
                    Helper.PrintMsg("PIN input not found, Try to link verification...");

                    try {
                        await Helper.SafeAction(this.page, this.page.getByRole('button', { name: 'Verifikasi melalui link' }), "click", { description: "Link verification" })
                        await Helper.Delay(2);
                        await Helper.SafeAction(
                            this.page, 
                            "button[role='button'][aria-label='Click the button to send the authentication link through SMS if you cannot receive WhatsAPP messages']",
                            'click', 
                            { description: "Button Send via SMS" }
                        );
                        Helper.PrintMsg("Please check your SMS for the verification link... waiting for 90 seconds");
                        await Helper.Delay(90);
                    } catch (error) {
                        Helper.PrintMsg("Link verification not found, maybe already verified. Skipping link verification...");
                    }
                }

                await Helper.SafeAction(this.page, "input[role='combobox']", "wait", { description: "Search form" });
                Helper.PrintMsg("Login successful, proceeding to dashboard...");
                await Helper.Delay(3);
            } catch (error) {
                Helper.PrintMsg("Login form not found, maybe already logged in. Skipping login process...");
            }
        } catch (error) {
            Helper.PrintErrorMsg(`Failed to access login page: ${error.message}`);
            throw error;
        }
    }
}

module.exports = ToDashboard;