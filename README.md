<h1>Deck Scraper</h1>
This is a web scraping application that checks the stock of the Steam Deck, and sends you a text when it's in stock!

## Contents

-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Monitoring a different steam deck model](#monitoring-a-different-steam-deck-model)
-   [Deployment](#deployment)

## Requirements

This project was written in node.js so make sure you have it installed on your system.

<details>
<summary>Help I'm scared and lost</summary>
<br>
If you are not sure, run the following command in your terminal/command propt:

```sh
node -v
```

This will check the version (if any) of Node.js you have installed.
Download at the following link if needed:
https://nodejs.org/en

</details>

## Installation

1. Download the files from this repository.
2. Open a new terminal/command propt and navigate to the root folder (Deck_Scraper-main).
3. Run the following command in the terminal/command propt.

```sh
npm install
```

This will install the node.js packages required:
**Puppeteer**, **Cheerio**, **Dotenv**, and **Twilio**

#### Configuring SMS

There is a little bit of set up required to get the SMS working. You need to make a (free) account with Twilio and enter the required details into the .env file. I've detailed the steps below:

First set up an account with Twilio:
https://www.twilio.com/en-us.
The free trial account will give you everything required for this script to work.

Once you make it to the console page, click 'get a free phone number'.
You also need your Account SID and Auth Token (found on the console page).

Next, open the .env file with a text editor (.env may be a hidden file) and paste the Account SID, Auth Token, twilio phone number, and your verfied phone number as shown in the comments in the file. Save and exit the file.

**Important Note**: Don't upload your edited .env file anywhere on the internet. Other people have web scrapers that will alert them that you have uploaded your twilio details and personal phone number.

Now you should be good to go!

## Usage

Open the root folder (Deck_Scraper-main) in your terminal/command propt and enter the following command:

```sh
npm start
```

This will run the script every 5 minutes on your computer, and output the current stock of each deck size in the command line.
If the 64GB model comes into stock you will be sent a text.

#### Monitoring a different Steam Deck model

I have it currently set to send an SMS if the 64GB model comes into stock.
If you want to send an SMS when a different model is in stock, you need to change some code in the scrape.js file.
See line 102:

```js
if (product.size64 == '64GB' && product.stock64 != 'Out of stock') {
```

Change it to the following to be notified when the 256GB model is in stock:

```js
if (product.size256 == '256GB' && product.stock256 != 'Out of stock') {
```
Note: The SMS text will still say 64GB

## Deployment

If you want this script to run on a server, I personally recommend setting it up to run on a raspberry pi. Another option would be to deploy it to a cloud service such as Google cloud or AWS.

