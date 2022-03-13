require("dotenv").config();

const puppeteer = require("puppeteer");
const $ = require("cheerio").default;
const CronJob = require("cron").CronJob;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  try {
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
      if (price < minPrice) {
        console.log(`🛍 Price on ${url} is less than ${minPrice}`);
        sendEmail(
          `🛍 Price Is Low!`,
          `Price on ${url} is less than ${minPrice}`
        );
      }
    });
  } catch (err) {
    sendEmail(
      `🛍 Price Check Failed`,
      `Price Check Failed on ${url} with error ${err.message}`
    );
    throw err;
  }
}

function sendEmail(subject, body) {
  const email = {
    to: "taxoha4598@tourcc.com",
    from: "milind.mishra4@gmail.com",
    subject: subject,
    text: body,
    html: body,
  };
  return sgMail.send(email);
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
