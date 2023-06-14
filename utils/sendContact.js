const puppeteer = require("puppeteer");
const randomUseragent = require("random-useragent");
const chromium = require("@sparticuz/chromium")
const fs = require("fs");

const randomizeTime = () => {
  return Math.floor(Math.random() * 3000) + 800;
};


const sendContact = async (userData) => {
  let err = null;
  let page;

  const header = randomUseragent.getRandom((ua) => {
    return ua.browserName === "Firefox";
  });
  console.log(header);

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
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

  page = (await browser.pages())[0];
  await page.setUserAgent(header);
  await page.setViewport({ width: 1920, height: 1080 });


  try {
    // Saved cookies reading
    console.log('entro a cookies')
    const cookies = fs.readFileSync("./utils/httpbin-cookies.json", "utf8");
    const deserializedCookies = JSON.parse(cookies);
    await page.setCookie(...deserializedCookies);
    await page.goto(`https://${userData.linkedin}`);
  } catch (error) {
    console.log("entro a login");
    await page.goto("https://www.linkedin.com/login");
    await page.waitForTimeout(randomizeTime());
    await page.click('#username')
    await page.waitForTimeout(randomizeTime())
    await page.type("#username", process.env.USER); //Cambiar el metodo para las contraseñas
    await page.waitForTimeout(randomizeTime());
    await page.click('#password')
    await page.waitForTimeout(randomizeTime())
    await page.type("#password", process.env.PASSWORD);
    console.log("puso usuario y contraseña");
    await page.waitForTimeout(randomizeTime());
    await page.click('button[data-litms-control-urn="login-submit"]');
    await page.waitForTimeout(randomizeTime());
    await page.goto(`https://www.${userData.linkedin}`);

    await page.waitForTimeout(randomizeTime());
    // Get cookies
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies);
    // And save this data to a JSON file
    fs.writeFileSync("./utils/httpbin-cookies.json", cookieJson);
  }


  await page.waitForTimeout(randomizeTime());

  try {
    await page.waitForTimeout(randomizeTime());
    await page.waitForSelector(`.pv-top-card-v2-ctas`);
    const div = await page.$eval(
      `.pv-top-card-v2-ctas >>>> button`,
      (el) => el.innerText
    );
    console.log(div);
    await page.click(".pv-top-card-v2-ctas >>>> button");
    await page.waitForTimeout(randomizeTime());
    await page.waitForSelector("#artdeco-modal-outlet");
    console.log("Open Modal");
    const button = await page.$$eval(
      `#artdeco-modal-outlet >>>> button`,
      (el) => el[0].outerHTML
    );
    console.log("Elemento a clickear: ", button);
    await page.click(`#artdeco-modal-outlet >>>> button`);
    await page.waitForTimeout(randomizeTime());
    await page.close();

    return (err = null);
  } catch (error) {
    console.log(error);
    return (err = "Error get data");
  }
};
module.exports = { sendContact };
