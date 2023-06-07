const puppeteer = require("puppeteer");
const randomUseragent = require("random-useragent");
const fs = require("fs");

const sendContact = async (data) => {
  let err = null;
  let page;
  const updatedData = []

  const header = randomUseragent.getRandom((ua) => {
    return ua.browserName === "Firefox";
  });
  console.log(header);

  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });
  page = (await browser.pages())[0];
  await page.setUserAgent(header);
  await page.setViewport({ width: 1920, height: 1080 });

  for (const item of data) {
    try {
      // Saved cookies reading
      const cookies = fs.readFileSync("./utils/bot-cookies.json", "utf8");
      const deserializedCookies = JSON.parse(cookies);
      await page.setCookie(...deserializedCookies);
      await page.goto(`https://${item.linkedin}`);
    } catch (error) {
      console.log(error);
      console.log("entro a login");
      await page.goto("https://www.linkedin.com/login");
      await page.waitForTimeout(3000);
      await page.type("#username", "msadeveloper@yahoo.com"); //Cambiar el metodo para las contraseñas
      await page.type("#password", "proyectolinkedin");
      await page.waitForTimeout(3000);
      await page.click('button[data-litms-control-urn="login-submit"]');
      await page.waitForTimeout(3000);
      await page.goto(`https://www.linkedin.com/in/alejandro-diaz-671563216/`);
  
      await page.waitForTimeout(3990);
      // Get cookies
      const cookies = await page.cookies();
      const cookieJson = JSON.stringify(cookies);
      // And save this data to a JSON file
      fs.writeFileSync("./utils/bot-cookies.json", cookieJson);
    }
  
    try {
      // Get Popup contact info
      await page.waitForTimeout(3621)
      await page.click("#top-card-text-details-contact-info");
      const profileSection = await page.waitForSelector(".pv-profile-section");
      await page.waitForTimeout(2513);
  
      const element = await profileSection.waitForSelector(
        'section >>>> ::-p-text("Conectado")'
      );
      const conectElement = await element.evaluate((element) => {
        console.log(element.textContent);
        return element.textContent;
      });
  
      if (conectElement === "Conectado") {
        updatedData.push({id: 65, aceptedContact: true})
      } else {
        updatedData.push(item)
      };
    } catch (error) {
      console.log(error);
    }

    browser.close()
  }  
  return updatedData;
};

module.exports = { sendContact };