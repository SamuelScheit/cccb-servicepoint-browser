import { createSocket } from "dgram";
import { cols, height, rows, rowSpacing, serverIP, serverPort, size, width } from "./constants";
import { CompressionCode, DisplayCommand } from "./types";

const socket = createSocket("udp4");

export function sendPacket(packet: Buffer) {
	return new Promise((resolve, reject) => {
		socket.send(packet, serverPort, serverIP, (err) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			resolve(null);
		});
	});
}

// 128 => 0b1000_0000
// >> shifts the most significant bit to the right
export function setBit(buffer: Buffer, i: number, bit: number) {
	buffer[i] |= 128 >> bit;
}

// Constructs the header for a packet and appends the payload
// a - d => parameters for the command
export function Packet(cmd: DisplayCommand, a: number = 0, b: number = 0, c: number = 0, d: number = 0, payload: Buffer = Buffer.alloc(0)) {
	const buf = Buffer.alloc(5 * 2);

	buf.writeUInt16BE(cmd, 0);
	buf.writeUInt16BE(a, 2);
	buf.writeUInt16BE(b, 4);
	buf.writeUInt16BE(c, 6);
	buf.writeUInt16BE(d, 8);

	return Buffer.concat([buf, payload]);
}

// image is assumed to be a grayscaled bytestream
export async function sendImage(image: Buffer) {
	const bits = Buffer.alloc((width * height) / size);
	const brightness = Array.from({ length: rows * cols }, () => 0);
	const brightnessBuffer = Buffer.alloc(rows * cols);

	let yOffset = 0;

	for (let y = 0; y < height; y++) {
		if (y % size === 0) {
			yOffset += rowSpacing;
		}

		for (let x = 0; x < width; x++) {
			const imageIndex = y * width + x + yOffset * width;
			const payloadByteIndex = Math.floor((y * width + x) / size);
			const bitIndex = (y * width + x) % size;
			const bit = image[imageIndex];

			if (bit > 100) {
				setBit(bits, payloadByteIndex, bitIndex);
			}

			const brightnessIndex = Math.floor(y / size) * cols + Math.floor(x / size);
			const brightnessValue = bit + brightness[brightnessIndex] || 0;

			brightness[brightnessIndex] = brightnessValue;
		}
	}

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			const brightnessIndex = y * cols + x;
			// 255 is the maximum brightness a grayscale pixel can have
			// 15 is the maximum brightness a display segment can have
			const value = (brightness[brightnessIndex] / (size * size) / 255) * 15;

			brightnessBuffer[brightnessIndex] = value;
		}
	}

	await sendPacket(Packet(DisplayCommand.CHARBRIGHTNESS, 0, 0, width, height, brightnessBuffer));
	await sendPacket(Packet(DisplayCommand.BITMAPLINEAR, 0, bits.length, CompressionCode.Uncompressed, 0, bits));
}
