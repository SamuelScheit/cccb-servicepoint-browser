import { DisplayCommand } from "./types";
import { Packet, sendPacket } from "./util";

sendPacket(Packet(DisplayCommand.CLEAR));
