import { rows, width } from "./constants";
import { DisplayCommand } from "./types";
import { Packet, sendPacket } from "./util";

sendPacket(Packet(DisplayCommand.UTF8DATA, 0, 0, width, rows, Buffer.from("Hello, World!")));
