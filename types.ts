export enum DisplayCommand {
	CLEAR = 0x0002,
	CP437DATA = 0x0003,
	CHARBRIGHTNESS = 0x0005,
	BRIGHTNESS = 0x0007,
	HARDRESET = 0x000b,
	FADE_OUT = 0x000d,
	BITMAPLEGACY = 0x0010,
	BITMAPLINEAR = 0x0012,
	BITMAPLINEARWIN = 0x0013,
	BITMAPLINEAR_AND = 0x0014,
	BITMAPLINEAR_OR = 0x0015,
	BITMAPLINEAR_XOR = 0x0016,
	BITMAPLINEARWIN_Z = 0x0017,
	BITMAPLINEARWIN_BZ = 0x0018,
	BITMAPLINEARWIN_LZ = 0x0019,
	BITMAPLINEARWIN_ZS = 0x001a,
	UTF8DATA = 0x0020,
}

export enum DisplaySubcommand {
	SUBCMD_BITMAP_NORMAL = 0x0,
	SUBCMD_BITMAP_COMPRESS_Z = 0x677a,
	SUBCMD_BITMAP_COMPRESS_BZ = 0x627a,
	SUBCMD_BITMAP_COMPRESS_LZ = 0x6c7a,
	SUBCMD_BITMAP_COMPRESS_ZS = 0x7a73,
}

export interface HdrWindow {
	command: number;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface HdrBitmap {
	command: number;
	offset: number;
	length: number;
	subcommand: number;
	reserved: number;
}

export enum CompressionCode {
	Uncompressed = 0x0,
	Zlib = 0x677a,
	Bzip2 = 0x627a,
	Lzma = 0x6c7a,
	Zstd = 0x7a73,
}
