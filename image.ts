import sharp from "sharp";
import { sendImage } from "./util";

const __dirname = new URL(".", import.meta.url).pathname;

async function main() {
	sendImage(
		await sharp(__dirname + "/image.png")
			.raw()
			.toBuffer()
	);
}

main();
