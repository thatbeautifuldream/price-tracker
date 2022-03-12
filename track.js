const puppeteer = require("puppeteer");
const $ = require("cheerio").default;
const CronJob = require("cron").CronJob;

// Price CSS Selector : #corePrice_desktop .a-price.a-text-price.a-size-medium.apexPriceToPay > .a-offscreen

const url = process.argv[2]; // node track <url>
const minPrice = process.argv[3]; // node track <url> <minPrice>

async function configureBrowser() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}

async function checkPrice(page) {
  await page.reload();
  let html = await page.evaluate(() => document.body.innerHTML);
  // console.log(html);

  $(
    "#corePrice_desktop .a-price.a-text-price.a-size-medium.apexPriceToPay > .a-offscreen",
    html
  ).each(function () {
    let ruppeePrice = $(this).text();
    // console.log(ruppeePrice);
    let price = parseInt(ruppeePrice.replace("₹", "").replace(",", ""));
    console.log(price);
    if (price > minPrice) {
      console.log(`Price is greater than ${minPrice}`);
    } else {
      console.log(`Price is less than ${minPrice}`);
    }
  });
}

async function startTracking() {
  const page = await configureBrowser();

  let job = new CronJob(
    "* */30 * * * *",
    function () {
      //runs every 30 minutes in this config
      checkPrice(page);
    },
    null,
    true,
    null,
    null,
    true
  );
  job.start();
}

startTracking();
