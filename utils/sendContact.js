const puppeteer = require("puppeteer");
const randomUseragent = require("random-useragent");
const chromium = require("@sparticuz/chromium")
const fs = require("fs");

const sendContact = async (userData, auth, user) => {
  let err = null;
  let page;

  const header = randomUseragent.getRandom((ua) => {
    return ua.browserName === "Firefox";
  });
  console.log(header);

  const browser = await puppeteer.launch({
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
    args: chromium.args,
    executablePath: await chromium.executablePath(),
  });
  page = (await browser.pages())[0];
  await page.setUserAgent(header);
  await page.setViewport({ width: 1920, height: 1080 });

  if (user.email !== null) {
    console.log("entro a login");
    await page.goto("https://www.linkedin.com/login");
    await page.waitForTimeout(3000);
    await page.type("#username", user.email); //Cambiar el metodo para las contraseñas
    await page.type("#password", user.password);
    await page.waitForTimeout(3000);
    await page.click('button[data-litms-control-urn="login-submit"]');
    await page.waitForTimeout(3000);
    await page.goto(`https://${userData.linkedin}`);
    console.log(`https://${userData.linkedin}`);
    await page.waitForTimeout(3000);
    // Get cookies
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies);
    // And save this data to a JSON file
    fs.writeFileSync("./utils/httpbin-cookies.json", cookieJson);
  } else {
    try {
      // Saved cookies reading
      const cookies = fs.readFileSync("./utils/httpbin-cookies.json", "utf8");
      const deserializedCookies = JSON.parse(cookies);
      await page.setCookie(...deserializedCookies);
      await page.goto(`https://${userData.linkedin}`);
      console.log(`https://${userData.linkedin}`);
    } catch (error) {
      console.log(error);
      await browser.close();
      return (err = "Error cookies login");
    }
  }

  try {
    await page.waitForTimeout(2000);
    await page.waitForSelector(`.pv-top-card-v2-ctas`);
    const div = await page.$eval(
      `.pv-top-card-v2-ctas >>>> button`,
      (el) => el.innerText
    );
    console.log(div);
    await page.click(".pv-top-card-v2-ctas >>>> button");
    await page.waitForTimeout(2000);
    await page.waitForSelector("#artdeco-modal-outlet");
    console.log("Open Modal");
    const button = await page.$$eval(
      `#artdeco-modal-outlet >>>> button`,
      (el) => el[0].outerHTML
    );
    console.log("Elemento a clickear: ", button);
    await page.click(`#artdeco-modal-outlet >>>> button`);
    await page.waitForTimeout(2000);
    await page.close();

    return (err = null);
  } catch (error) {
    console.log(error);
    return (err = "Error get data");
  }
};
module.exports = { sendContact };
