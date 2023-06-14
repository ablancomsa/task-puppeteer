const randomUseragent = require("random-useragent");
const puppeteer = require("puppeteer");
const fs = require("fs");

const randomizeTime = (time = 4000) => {
  return Math.floor(Math.random() * time) + 2000;
};

const scrollSearch = async (pixels = 100) => {
  // Scroll the page to the bottom
  const distance = (Math.random() * 20) + pixels;
  await page.evaluate(() => {
    window.scrollBy(0, distance);
  });
}

const getUserData = async (url) => {
  //TODO: Aca esta la funcion de extraer los datos del perfil
  // GO TO PROFILE PAGE --------------------------------------------------------------------------------------------------------------------------------------------------
  await page.waitForTimeout(randomizeTime());
  console.log(`Perfil ${countProfiles}: ${url}`);

  // Get Data
  await page.waitForSelector(".pv-text-details__left-panel");
  // await page.screenshot({ path: `src/linkedin/profiles/${countProfiles}.png` });

  const profile = {
    name: "X",
    description: [],
    university: [],
    company: "X",
    grade: "X",
    role: "X",
    date: "X",
    email: "X",
    phone: "X",
    link: "X",
    imgUrl: "X",
  };

  //Get First Data (no popup)
  profile.name = await getWebData(".pv-text-details__left-panel h1", page);
  profile.grade = await getWebData(
    ".pv-text-details__left-panel .dist-value",
    page
  );
  profile.description = await getWebData(
    ".pv-text-details__left-panel .text-body-medium",
    page
  );

  profile.company = await getWebData(
    ".pv-text-details__right-panel .inline-show-more-text",
    page,
    0
  );
  profile.university = await getWebData(
    ".pv-text-details__right-panel .inline-show-more-text",
    page,
    1
  );
  try {
    await page.waitForSelector(
      `img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show evi-image ember-view"]`
    );
    profile.imgUrl = await page.$eval(
      `img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show evi-image ember-view"]`,
      (el) => el.src
    );
  } catch (error) {
    console.log(error);
    profile.imgUrl = "X";
  }

  // NOTE: Obtencion de la experiencia y los estudios de la persona
  try {
    const indexRole = 0; //1 = alejandro, 0 = fernando
    const indexUniveristy = 1;
    const experiencie = [];
    const university = [];

    // NOTE: Obtencion de la experiencia de la persona
    // Obtener todos los elementos que coinciden con el selector (el + hace alusión al hermano próximo, como nextSibling)
    await scrollSearch(200)
    await page.waitForSelector(randomizeTime(2000))
    const elements = await page.$$(
      ".pvs-header__container + .pvs-list__outer-container"
    );
    const experienceInfo = await elements[indexRole].$$(
      "ul.pvs-list > li > div.pvs-entity"
    );
    for (const item of experienceInfo) {
      const newExperiencie = await item.$$eval(
        `span.visually-hidden`,
        (el) => el.map((node) => node.textContent)
      );
      experiencie.push({ experiencie: newExperiencie });
    }
    profile.role = [...experiencie];

    //NOTE: Obtencion de las universidades en las que se ha estudiado
    await page.waitForSelector(randomizeTime(4000))
    await scrollSearch(100)
    const universityInfo = await elements[indexUniveristy].$$(
      "ul.pvs-list > li > div.pvs-entity"
    );
    for (const item of universityInfo) {
      const newUnivesity = await item.$$eval(`span.visually-hidden`, (el) =>
        el.map((node) => node.textContent)
      );
      university.push({ university: newUnivesity });
    }
    profile.university = [...university];
  } catch (error) {
    profile.role = "xx";
    console.log(error);
  }

  // Get Popup contact info
  try {
    await page.waitForTimeout(randomizeTime())
    await scrollSearch(300)
    await page.waitForSelector("#top-card-text-details-contact-info")
    await page.click("#top-card-text-details-contact-info");
    await page.waitForSelector(".pv-contact-info__ci-container");
    await page.waitForTimeout(randomizeTime());
  } catch (error) {
    console.log(error);
  }

  try {
    profile.email = await getWebData(
      ".ci-email .pv-contact-info__ci-container a",
      page
    );
  } catch (e) {
    profile.email = "X"; // o un valor predeterminado
  }

  try {
    profile.phone = await getWebData(
      ".ci-phone .pv-contact-info__ci-container span",
      page,
      0
    );
  } catch (e) {
    profile.phone = "X"; // o un valor predeterminado
  }

  try {
    profile.link = await getWebData(
      ".ci-vanity-url .pv-contact-info__ci-container a",
      page,
      0
    );
  } catch (e) {
    profile.link = "X"; // o un valor predeterminado
  }

  return profile;
  
}

const getNewUsers = async (userData) => {
  let browser;
  let data = [];
  let urls = [];
  let authenticated = userData.auth;
  let page;

  const searchUrl =
    "";
  const initialization = async () => {
    const header = randomUseragent.getRandom((ua) => {
      return ua.browserName === "Firefox";
    });

    browser = await puppeteer.launch({
      headless: false,
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
      console.log("Load cookies reading");
      const cookies = fs.readFileSync("./utils/httpbin-cookies.json", "utf8");
      console.log("loaded cookies reading");
      const deserializedCookies = JSON.parse(cookies);
      console.log("parsed cookies reading");
      await page.setCookie(...deserializedCookies);
      console.log("set cookie", deserializedCookies);

      await page.goto(`${searchUrl}`);
      console.log("goto cookies reading");
    } catch (error) {
      await page.goto(`${searchUrl}`, { waitUntil: "load" });

      console.log("Visitando pagina ==> linkedin");

      await page.waitForTimeout(3000);
      await page.waitForSelector(".main__sign-in-link");
      await page.click(".main__sign-in-link");

      await page.waitForTimeout(3000);
      // await page.screenshot({ path: 'src/linkedin/screenshot.png' });
      await page.waitForSelector(".login__form_action_container");
      console.log("Ingresando a la página de login");
      await page.waitForTimeout(1000);
      await page.click("#username");
      const username = await page.$("#username");
      await page.waitForTimeout(3000);
      await page.click("#password");
      const password = await page.$("#password");

      // Login with username and password

      await username.type(userData.email);
      await password.type(userData.password);

      // Click login btn
      await page.waitForSelector(".login__form_action_container");
      console.log("Click login btn");
      await page.waitForTimeout(3000);
      await page.click(".login__form_action_container button");
      await page.waitForTimeout(3000);
      // await page.screenshot({ path: 'src/linkedin/screenshot3.png' });
      await page.waitForSelector(".reusable-search__result-container");

      const cookies = await page.cookies();
      const cookieJson = JSON.stringify(cookies);
      // // And save this data to a JSON file
      fs.writeFileSync("./utils/httpbin-cookies.json", cookieJson);
      console.log("Cookies saved to httpbin-cookies.json", cookieJson);
    }

    // START SAVE ALL URLS ------------------------------------------------------------------------------------------------------------------------------------------
    let count = 0;
    let pagination = 1;

    const getUrls = async () => {
      await page.waitForTimeout(randomizeTime());
      await page.waitForSelector(".reusable-search__result-container");
      await page.waitForTimeout(randomizeTime());
      const items = await page.$$(".reusable-search__result-container");

      for (const item of items) {
        count++;
        console.log(count);

        const objectNextButton = await item.$("a");
        const getUrl = await page.evaluate(
          (objectNextButton) => objectNextButton.getAttribute("href"),
          objectNextButton
        );

        // Intentar obtener el nombre de la persona, si se obtiene, se extrae su url, en caso contrario, significa que es un Miembro de LinkedIn fuera de la red de contactos
        try {
          const namePerson = await item.$(
            ".entity-result__title-line a span span"
          );
          const namePersonText = await page.evaluate(
            (namePerson) => namePerson.innerText,
            namePerson
          );
          console.log(namePersonText);

          count = 6 ? scrollSearch() : null;

          if (namePersonText != "BRUNO Alexis 9duyriurieiufye") {
            urls = [...urls, getUrl];
            //TODO: Aca debe ir la funcion de entrar al perfil
            await page.click(objectNextButton)
            const response = await getUserData(getUrl)
            data = [...data, response]
            await page.goBack();
            await page.waitForTimeout(randomizeTime());
            console.log(getUrl);
          }
        } catch (error) {
          console.log("Miembro de LinkedIn");
        }

        // await page.screenshot({ path: `src/linkedin/img/${count}.png` });
      }

      await page.waitForSelector(".artdeco-pagination__button--next");
      await page.click(".artdeco-pagination__button--next");
      console.log("Click NEXT");
    };

    while (pagination <= 2) {
      await getUrls();
      pagination++;
    }
    // END SAVE ALL URLS ------------------------------------------------------------------------------------------------------
    
    await browser.close();
  };

  const getWebData = async (selector, page, elementIndex = 0) => {
    const elements = await page.$$(selector);
    if (elements[elementIndex]) {
      const element = elements[elementIndex];
      const elementText = await element.evaluate((node) => node.innerText);
      return elementText;
    } else {
      return "X";
    }
  };

  await initialization();
  console.log(data);
  return data;
};

module.exports = { getNewUsers };
