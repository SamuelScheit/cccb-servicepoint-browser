import { launch } from "puppeteer-core";
import { imageHeight, width } from "./constants";
import sharp from "sharp";
import { sendImage } from "./util";

const browser = await launch({
	executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	headless: false,
	args: [`--window-size=${width},${imageHeight}`],
});

const page = await browser.newPage();
await page.goto(`https://xnacly.me`);

await page.setViewport({
	width: width,
	height: imageHeight,
	deviceScaleFactor: 1,
});

const session = await page.createCDPSession();

session.on("Page.screencastFrame", async ({ data, sessionId }) => {
	const buffer = Buffer.from(data, "base64");

	// resize not needed, because viewport is already set to the right size
	const image = await sharp(buffer)
		// .resize(width, imageHeight, {
		// 	fit: "contain",
		// })
		.grayscale(true)
		.raw()
		.toBuffer();

	await sendImage(image);

	await session.send("Page.screencastFrameAck", { sessionId });
});

await session.send("Page.startScreencast", {
	everyNthFrame: 1,
	format: "jpeg",
	maxHeight: imageHeight,
	maxWidth: width,
	quality: 80,
});
