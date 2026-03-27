const Helper = require("../Helpers/Helper");

class ToDashboard {
    constructor(page) {
        this.page = page;
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
                    (p) => p.getByRole('button', { name: 'Bahasa Indonesia' }),
                    'click',
                    { description: "Selecting language" }
                );
            } catch (error) {
                Helper.PrintMsg("Language selection not found, maybe already selected. Skipping language selection...");
            }

            try {
                Helper.PrintMsg("Checking Login Form...");
                await Helper.SafeAction(this.page, "input[type='text'][name='loginKey']", "type", {
                    value: this.config.loginId,
                    description: "Login ID"
                });
                await Helper.SafeAction(this.page, "input[type='password'][name='password']", "type", {
                    value: this.config.loginPassword,
                    description: "Password"
                });
                await Promise.all([
                    this.page.waitForNavigation({ waitUntil: 'load' }),
                    Helper.SafeAction(this.page, "button:has-text('Log In')", "click", {
                        description: "Button login"
                    })
                ]);

                try {
                    Helper.PrintMsg("Checking PIN Input...");
                    await Promise.all([
                        this.page.waitForNavigation({ waitUntil: 'load' }),
                        await Helper.SafeAction(this.page, "button[aria-label='Verifikasi dengan PIN ShopeePay']", "click", { description: "Button PIN verification" })
                    ]);
                    await Helper.Delay(1);

                    await this.page.keyboard.type(this.config.loginPin);
                    await Helper.Delay(1);

                    await Promise.all([
                        this.page.waitForNavigation({ waitUntil: 'load' }),
                        await Helper.SafeAction(this.page, "button:has-text('OK')", "click", { description: "Button OK" })
                    ]);
                } catch (error) {
                    Helper.PrintMsg("PIN input not found, maybe already passed PIN verification. Skipping PIN input...");
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