# 🛍 (Amazon.in) Price Tracker

JavaScript quickstart project for `amazon.in` price tracking.

## Tools

- NodeJs
- Puppeteer
- SendGrid/Mail
- CronJob

## Requirements

In order to utilise this project you need to have the following installed locally:

- nodejs
- npm
- [puppeteer](https://npmjs.com/puppeteer)
- [cheerio](https://npmjs.com/cheerio)
- [sendgrid/mail](https://npmjs.com/sendgrid)
- [cron](https://npmjs.com/cron)

To install the dependencies locally run:

```js
npm install dependencies
```

In order for the price tracking to pass, you will need to configure the script with the following parameters:

- Setup/Replace the to and from email addresses in the `sendEmail()` function

```js
function sendEmail(subject, body) {
  const email = {
    to: "*****@yourmail.com",
    from: "*****@yourmail.com",
    subject: subject,
    text: body,
    html: body,
  };
  return sgMail.send(email);
}
```

- Setup/Replace the sendgrid api key from the sendgrid account, and place it locally in a `.env` file.

```text
SENDGRID_API_KEY= *****
```

- Setup/Replace the cron job with desired time interval in the `startTracking()` function

```js
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
```

## Usage

The project is basically a Nodejs script that can be run from the command line.
In order to run this locally you need to clone the project and set up requirements and run the command:

```bash
node track <amazon.in-url-to-track> <price-threshold>
```

- `amazon.in-url-to-track` is the url of the product you want to track
- `price-threshold` is the price limit you want to track for the product

## Demo Video

https://user-images.githubusercontent.com/28717686/158068407-8331c5ff-81da-4974-92ff-5c1581f4515c.mp4





