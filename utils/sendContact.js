const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const fs = require('fs');

const sendContact = async (userData, auth) => {
  let err;
  let page;
  
  const header = randomUseragent.getRandom((ua) => {
    return ua.browserName === 'Firefox';
  });
  console.log(header)
  
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
    const cookies = fs.readFileSync('./utils/httpbin-cookies.json', 'utf8');
    const deserializedCookies = JSON.parse(cookies);
    await page.setCookie(...deserializedCookies);
    console.log('setCookies')
    console.log(userData.linkedin)
    await page.goto(`https://${userData.linkedin}`, { waitUntil: 'load' });
    console.log('goto')
    
  }catch(error){
    await page.goto('https://www.linkedin.com/login');
    await page.type('#username', userData.email);
    await page.type('#password', userData.password);
    await page.waitForTimeout(3000);
    await page.click('button[data-litms-control-urn="login-submit"]');
    await page.waitForTimeout(3000);
    await page.goto(`https://${userData.linkedin}`);

    await page.waitForTimeout(3000);
    // Get cookies
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies)
    
    // And save this data to a JSON file
    fs.writeFileSync('httpbin-cookies.json', cookieJson);
  }
  try{
    console.log('Contact')
    await page.waitForSelector(`.pv-top-card-v2-contact-info`);
    await page.waitForTimeout(2000);
    await page.waitForSelector(`.pv-top-card-v2-ctas`);
    const div = await page.$eval(`.pv-top-card-v2-ctas >>>> button`, el => el.innerText);
    console.log(div)
    await page.click(".pv-top-card-v2-ctas >>>> button");
    await page.waitForTimeout(2000);
    await page.waitForSelector('#artdeco-modal-outlet')
    console.log('Open Modal')
    const button = await page.$$eval(`#artdeco-modal-outlet >>>> button`, el => el[0].outerHTML);
    console.log('Elemento a clickear: ',button)
    await page.click(`#artdeco-modal-outlet >>>> button`);
    await page.waitForTimeout(2000);
    await page.close()
  
    return true
  } catch(error){
    err = true
    console.log(error)
    return false
  }

}
module.exports = {sendContact};