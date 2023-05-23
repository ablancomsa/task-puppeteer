const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const fs = require('fs');

const sendContact = async (userData, auth) => {

  let page;
  
  const header = randomUseragent.getRandom((ua) => {
    return ua.browserName === 'Firefox';
  });
  console.log(header)
  
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: ['--disable-features=IsolateOrigins']
    
  });
  page = (await browser.pages())[0];
  await page.setUserAgent(header);
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    if (auth === 'not authenticated') {
      await page.goto('https://www.linkedin.com/login');
      await page.type('#username', 'msadeveloper@yahoo.com');
      await page.type('#password', 'proyectolinkedin');
      await page.waitForTimeout(3000);
      await page.click('button[data-litms-control-urn="login-submit"]');
      await page.waitForTimeout(3000);
      console.log(userData.linkedin)
      await page.goto(`https://${userData.linkedin}`);

      await page.waitForTimeout(3000);
      // Get cookies
      const cookies = await page.cookies();
      const cookieJson = JSON.stringify(cookies)
      
      // And save this data to a JSON file
      fs.writeFileSync('httpbin-cookies.json', cookieJson);
      console.log('Cookies saved to httpbin-cookies.json', cookieJson);
    }else{
      // Saved cookies reading
      console.log('entro al else')
      const cookies = fs.readFileSync('./utils/httpbin-cookies.json', 'utf8');
      console.log('cookies', cookies);
      const deserializedCookies = JSON.parse(cookies);
      console.log('deserializedCookies', deserializedCookies);
      await page.setCookie(...deserializedCookies);
      console.log('set cookie', deserializedCookies);
      await page.goto(`https://${userData.linkedin}`);
    }
  }catch(error){
    console.log('Log In')
    console.log(error)
    authenticated = 'not authenticated';
  }
  await page.waitForTimeout(3000);
  await page.waitForSelector(`.pv-top-card-v2-ctas >>> button`);
  const div = await page.$(`.pv-top-card-v2-ctas >>> button`);
  console.log(div);
  await page.click(`.pv-top-card-v2-ctas >>> button`);
  await page.waitForTimeout(3000);
  await page.close()

  return true
}

module.exports = {sendContact};