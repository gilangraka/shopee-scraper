const Helper = require("../Helpers/Helper");

class ScrapPendingData {
    constructor(page, config) {
        this.page = page;
        this.config = config;
    }

    async run(pendingData) {
        try {
            const isArrayOfString = Array.isArray(pendingData) && pendingData.every(item => typeof item === 'string');
            if (!isArrayOfString) return;

            const storedData = [];

            for (const data of pendingData) {
                Helper.PrintMsg(`Scraping data for: ${data}`);

                // 1. Navigasi ke halaman search Tokopedia
                await this.page.goto(`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(data)}`, {
                    waitUntil: 'domcontentloaded',
                    timeout: 60000
                });

                // 2. Tunggu container produk muncul
                await this.page.waitForSelector('[data-testid="divSRPContentProducts"]', { timeout: 10000 });

                // 3. Ambil data produk pertama
                const object = await this.page.evaluate(() => {
                    const container = document.querySelector('[data-testid="divSRPContentProducts"]');
                    if (!container) return null;

                    // Ambil card produk pertama (tag <a> pertama yang punya href tokopedia)
                    const firstCard = container.querySelector('a[href*="tokopedia.com"]');
                    if (!firstCard) return null;

                    // Ambil semua span di dalam card untuk fallback
                    const allSpans = firstCard.querySelectorAll('span');

                    // img_url
                    const imgEl = firstCard.querySelector('img[alt="product-image"]');
                    const img_url = imgEl ? imgEl.src : null;

                    // link_url
                    const link_url = firstCard.href || null;

                    // name → span pertama yang punya teks cukup panjang (lebih dari 10 karakter)
                    let name = null;
                    for (const span of allSpans) {
                        if (span.innerText && span.innerText.trim().length > 10) {
                            name = span.innerText.trim();
                            break;
                        }
                    }

                    // price → span yang teksnya diawali "Rp"
                    let price = null;
                    for (const span of allSpans) {
                        const text = span.innerText?.trim();
                        if (text && text.startsWith('Rp') && !text.includes(' ')) {
                            price = text;
                            break;
                        }
                    }

                    // rating → span yang isinya angka desimal antara 1.0 - 5.0
                    let rating = null;
                    for (const span of allSpans) {
                        const text = span.innerText?.trim();
                        if (text && /^[1-5](\.[0-9])?$/.test(text)) {
                            rating = text;
                            break;
                        }
                    }

                    // total_buy → span yang mengandung kata "terjual"
                    let total_buy = null;
                    for (const span of allSpans) {
                        const text = span.innerText?.trim();
                        if (text && text.toLowerCase().includes('terjual')) {
                            total_buy = text;
                            break;
                        }
                    }

                    return { name, price, total_buy, rating, img_url, link_url };
                });

                if (object) {
                    Helper.PrintMsg(`Successfully scraped: ${object.name}`);
                    storedData.push(object);
                } else {
                    Helper.PrintErrorMsg(`Failed to get product data for: ${data}`);
                    storedData.push({
                        name: null,
                        price: null,
                        total_buy: null,
                        rating: null,
                        img_url: null,
                        link_url: null,
                    });
                }
            }

            return storedData;

        } catch (error) {
            Helper.PrintErrorMsg(`Failed to scrap pending data: ${error.message}`);
            throw error;
        }
    }
}

module.exports = ScrapPendingData;