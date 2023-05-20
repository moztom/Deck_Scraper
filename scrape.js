//This is a program to check the stock of the steam deck

//Packages
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const mySMS = process.env.MY_SMS;
const twilioSMS = process.env.TWILIO_SMS;
const client = require('twilio')(accountSid, authToken);

const url = 'https://store.steampowered.com/steamdeck';

const product = {
	size64: '',
	stock64: '',
	size256: '',
	stock256: '',
	size512: '',
	stock512: '',
	link: '',
};

//Set interval
const handle = setInterval(scrape, 300000);

/*
This function scrapes the Steam website for the stock info of each Steam Deck size.
It fetches all the stock data before calling the SMS function if it's in stock.
*/
async function scrape() {
	//Fetch all the html data with Puppeteer
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const [page] = await browser.pages();
	await page.goto(url, { timeout: 0 }, { waitUntil: 'networkidle0' });
	const html = await page.content();
	await browser.close();

	//Load the html with Cheerio so we can use it
	const $ = cheerio.load(html);

	//Narrow down the html to smaller sections (containers)
	//Fetch each div box containing a Steam Deck size
	const container64 = $(
		'div.reservations_reservation_ctn_15uTq.reservation_ctn'
	).get(0);
	const container256 = $(
		'div.reservations_reservation_ctn_15uTq.reservation_ctn'
	).get(1);
	const container512 = $(
		'div.reservations_reservation_ctn_15uTq.reservation_ctn'
	).get(2);

	const containers = [container64, container256, container512];

	/*
	This function fetches the size and stock info from each container. It assigns each value
	in the product object.
	*/
	function fetchData(value) {
		//Fetch the size
		const size = $(value)
			.find(
				'div.bbcodes_Header2_2ZqUv.BB_Header2.eventbbcodeparser_Header2_1SWg2'
			)
			.text();
		//Fetch the stock
		var stock = $(value)
			.find(
				'button.reservations_reservebutton_15UWX.DialogButton._DialogLayout.Secondary.Disabled.Focusable'
			)
			.text();

		//Handling a 'Buy Now!' button
		if (stock == '') {
			stock = $(value)
				.find('button.DialogButton._DialogLayout.Secondary.Focusable')
				.text();
		}

		//Assign values to product object
		if (size == '64GB') {
			product.size64 = size;
			product.stock64 = stock;
		} else if (size == '256GB') {
			product.size256 = size;
			product.stock256 = stock;
		} else if (size == '512GB') {
			product.size512 = size;
			product.stock512 = stock;
		}
	}

	product.link = url;

	containers.forEach(fetchData);

	//If it's in stock, send SMS
	if (product.size64 == '64GB' && product.stock64 != 'Out of stock') {
		SMS();
	} else {
		//console.log(product);
		console.log(
			'Current stock:\n' +
				product.size64 +
				' - ' +
				product.stock64 +
				'\n' +
				product.size256 +
				' - ' +
				product.stock256 +
				'\n' +
				product.size512 +
				' - ' +
				product.stock512 +
				'\n\nNext check in 5 minutes\n'
		);
	}
}

/*
This function sends an SMS via Twillio
*/
function SMS() {
	client.messages
		.create({
			body: ` \n\nHOLY MOTHER IT'S IN STOCK\n\n${product.size64} - ${product.stock64}\n${product.link}`,
			from: twilioSMS,
			to: mySMS,
		})
		.then((message) => {
			console.log(product);
			console.log(message);
			clearInterval(handle);
		});
}

scrape();
