import { Sprite } from "excalibur";
import { TileKind, LEVEL_TILE_SPRITE } from "../resources";
import { TokenData } from "./token.model";

export interface LevelData {
    name: string;
    levelType: string; // e.g. "puzzle"
    charMap: string[];   // array of strings representing the level layout, each character corresponds to a tile type
    tileGrid: TileKind[][]; // 2D array of TileKind derived from charMap for easier access during gameplay
    botFacing: "Up" | "Down" | "Left" | "Right"; // initial facing direction of the bot
    nextLevel: string | null; // name of the next level, null if this is the last level
    tokens: TokenData[]; // array of tokens to place in the level, in specific order
    numTokens: number;   // number of tokens placeable in the level
    instructionText: string[]; // array of instruction strings to show the player before starting the level
    instructionIcon: Sprite; // icon from to show above the instructions
    instructionIconText: string; // text to show next to the instruction icon
}

export type LevelGrid = TileKind[][];

export function getTileChar(charMap: string[], posX: number, posY: number): string | undefined {
  if (!charMap) return undefined;
  if (posY < 0 || posY >= charMap.length) return undefined;
  const row = charMap[posY];
  if (posX < 0 || posX >= row.length) return undefined;
  return row.charAt(posX);
}

export function getLevelTileSprite(tileChar: string | undefined): Sprite {
    let spr: Sprite;

    if (!tileChar) {
        return LEVEL_TILE_SPRITE.unknown;
    }

    switch (tileChar) {
        case '.':
            spr = LEVEL_TILE_SPRITE.floor;
            break;
        case 'w':
            spr = LEVEL_TILE_SPRITE.wall;
            break;
        case 'e':
            spr = LEVEL_TILE_SPRITE.enter;
            break;
        case 'x':
            spr = LEVEL_TILE_SPRITE.exit;
            break;
        case ' ':
            spr = LEVEL_TILE_SPRITE.black;
            break;
        default:
            spr = LEVEL_TILE_SPRITE.unknown;
            break;
    }
    return spr;
}

