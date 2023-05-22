const puppeteer = require("puppeteer");
const randomUseragent = require("random-useragent");
require("dotenv").config();


const scrapeLogic = async (res) => {
  const header = randomUseragent.getRandom((ua) => {
    return ua.browserName === 'Firefox';
  });

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    console.log('start')
    const page = await browser.newPage();
    // await page.waitForSelector('body');
    // await page.setUserAgent(header);
    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    await page.goto("https://developer.chrome.com/");
    console.log('go to page')

    //await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    console.log('got selector')

    // Type into search box
    await page.type(".search-box__input", "customize");

    // Wait and click on first result
    const searchResultSelector = ".search-box__link";
    await page.waitForSelector(searchResultSelector);
    console.log('got result')
    await page.click(searchResultSelector);

    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
      "text/Customize DevTools"
    );
    const fullTitle = await textSelector.evaluate((el) => el.textContent);

    // Print the full title
    const logStatement = `The title of this blog post is ${fullTitle}`;
    console.log(logStatement);
    res.send(logStatement);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
