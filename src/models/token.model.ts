import { Sprite } from "excalibur";

export type TokenType = "fwd" | "fwd2" | "fwd3" | "fwd4" | "tr" | "tl" | "pu" | "pd" | "use";

export type TokenCommand = "fwd" | "tr" | "tl" | "pu" | "pd" | "use";

export interface TokenData {
    commands: TokenCommand[]; // e.g. ["fwd", "fwd"] for fwd2 token
    graphic: Sprite;
}