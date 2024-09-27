const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('Header', () => {
    it("`Header` should use a logo from the `assets` folder", async () => {
        const logo = await page.$('img[src*="logo"]');
        expect(logo).toBeTruthy();
    });
    it("`Header` should contain the Hamburger menu image", async () => {
        const hamburger = await page.$('img[src*="menu"]');
        expect(hamburger).toBeTruthy();
    });
});

describe('Hero Section', () => {
    it("`Hero` section should use `hero.svg` image", async () => {
        const hero = await page.$('img[src*="hero"]');
        expect(hero).toBeTruthy();
    });
    it("`Hero` section should contain a button that reads 'Learn More'", async () => {
        const buttons = await page.$('button');
        for (let i = 0; i < buttons.length; i++) {
            const innerText = await buttons[i].getProperty('innerText').then(text => text.jsonValue());
            expect(innerText).toMatch(/\S/);
        }
    });
});

describe('Services', () => {
    it("`Services` section should contain a list of services", async () => {
        const servicesListItemsText = await page.$$eval('li', (lis) => lis.map((li) => li.innerText));
        expect(servicesListItemsText).toEqual(expect.arrayContaining([expect.any(String)]));
    });
});

describe('Footer', () => {
    it("`Footer` should contain social media font awesome icons", async () => {
        const footerIcons = await page.$$('[class*="fa"]');
        expect(footerIcons.length).toBeGreaterThan(1);
    });
});

describe('Typography', () => {
    it("Headlines have the specified color", async () => {
        const colors = await page.$$eval('*', els => els.map(el => getComputedStyle(el).color))
        expect(colors).toContain('rgb(0, 15, 55)')
    })

    it("Text paragraphs have the specified color", async () => {
        const colors = await page.$$eval('*', els => els.map(el => getComputedStyle(el).color))
        expect(colors).toContain('rgb(79, 79, 79)')
    })

    it('"Open Sans" font is used', async () => {
        const colors = await page.$$eval('*', els => els.map(el => getComputedStyle(el).fontFamily))
        expect(colors.join(" ")).toMatch(/Open Sans/i)
    })
})