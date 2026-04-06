const { chromium } = require('playwright-extra');
const axios = require('axios').default;
const Helper = require('./Helpers/Helper.js');
const path = require('path');
const ToDashboard = require('./Functions/ToDashboard.js');
const GetFirebaseOldestPendingData = require('./Functions/GetFirebaseOldestPendingData.js');
const ScrapPendingData = require('./Functions/ScrapPendingData.js');
const stealth = require('puppeteer-extra-plugin-stealth')();

chromium.use(stealth);

class WebScraper {

    constructor(config = {}) {
        this.config = {
            headless: String(process.env.HEADLESS_MODE).toLowerCase() === 'true',
            pageUrl: process.env.PAGE_URL,
            loginId: process.env.LOGIN_ID,
            loginPassword: process.env.LOGIN_PASSWORD,
            loginPin: process.env.LOGIN_PIN,
            userDataDir: path.resolve(__dirname, './browser_session'),
            ...config
        };

        this.context = null;
        this.page = null;
    }

    async init() {
        const proxyConfig = process.env.PROXY_SERVER ? {
            server: process.env.PROXY_SERVER,
            username: process.env.PROXY_USERNAME,
            password: process.env.PROXY_PASSWORD
        } : undefined;

        this.context = await chromium.launchPersistentContext(this.config.userDataDir, {
            headless: this.config.headless,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36',
            proxy: proxyConfig
        });

        const pages = this.context.pages();
        this.page = pages.length > 0 ? pages[0] : await this.context.newPage();

        process.on('SIGINT', async () => {
            console.log("\nShutting down gracefully...");
            await this.close();
            process.exit(0);
        });
    }

    async close() {
        if (this.context) {
            await this.context.close();
        }
    }

    async run() {
        const ToDashboardInstance = new ToDashboard(this.page);
        const GetFirebaseOldestPendingDataInstance = new GetFirebaseOldestPendingData(this.page);
        const ScrapPendingDataInstance = new ScrapPendingData(this.page);

        console.log("Starting bot...");

        Helper.PrintMsg("Accessing Login Page...");
        await this.page.goto(this.config.pageUrl, { waitUntil: 'load' });
        await Helper.Delay(3);

        await ToDashboardInstance.run();
        while (true) {
            try {
                let pendingData = null;
                while (!pendingData) {
                    Helper.PrintMsg("...Checking for pending data...");
                    pendingData = await GetFirebaseOldestPendingDataInstance.run();
                    await Helper.Delay(3);
                }

                await ScrapPendingDataInstance.run(pendingData);
            } catch (err) {
                console.error("Error when scraping, restarting instance:", err);
                await Helper.Delay(5);
            }
        }
    }
}

module.exports = WebScraper;