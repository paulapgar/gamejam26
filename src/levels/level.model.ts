import { Sprite } from "excalibur";
import { TileKind, TILE_DEFS, BKG_TILE_DEFS, LEVEL_TILE_DEFS } from "../resources";

export type LevelGrid = TileKind[][];

export function getTileDefAt(grid: LevelGrid, x: number, y: number) {
  if (y < 0 || y >= grid.length) return undefined;
  if (x < 0 || x >= grid[y].length) return undefined;
  const kind = grid[y][x];
  return TILE_DEFS[kind];
}

export function getTileChar(charMap: string[], posX: number, posY: number): string | undefined {
  if (!charMap) return undefined;
  if (posY < 0 || posY >= charMap.length) return undefined;
  const row = charMap[posY];
  if (posX < 0 || posX >= row.length) return undefined;
  return row.charAt(posX);
}

export function getBkgTileSprite(tileChar: string | undefined): Sprite {
    let spr: Sprite;

    if (!tileChar) {
        return BKG_TILE_DEFS.unknown;
    }

    switch (tileChar) {
          case "_":
            spr = BKG_TILE_DEFS.topBorder;
            break;
          case "|":
            spr = BKG_TILE_DEFS.leftBorder;
            break;
          case "l":
            spr = BKG_TILE_DEFS.rightBorder;
            break;
          case "=":
            spr = BKG_TILE_DEFS.middleHorizontal;
            break;
          case ">":
            spr = BKG_TILE_DEFS.leftT;
            break;
          case "<":
            spr = BKG_TILE_DEFS.rightT;
            break;
          case "-":
            spr = BKG_TILE_DEFS.bottomBorder;
            break;
          case ".":
            spr = BKG_TILE_DEFS.topLeftBorder;
            break;
          case ",":
            spr = BKG_TILE_DEFS.topRightBorder;
            break;
          case "`":
            spr = BKG_TILE_DEFS.bottomLeftBorder;
            break;
          case "/":
            spr = BKG_TILE_DEFS.bottomRightBorder;
            break;
          case " ":
            spr = BKG_TILE_DEFS.black;
            break;
          default:
            spr = BKG_TILE_DEFS.unknown;
            break;
        }
    return spr;
}

export const BACKGROUND_TILES: string[] = [
  '.__________,        ',
  '|          l        ',
  '|          l        ',
  '|          l        ',
  '|          l        ',
  '|          l        ',
  '|          l        ',
  '|          l        ',
  '|          l        ',
  '|          l        ',
  '|          l        ',
  '>==========<        ',
  '|          l        ',
  '|          l        ',
  '`----------/        ',
];


export function getLevelTileSprite(tileChar: string | undefined): Sprite {
    let spr: Sprite;

    if (!tileChar) {
        return LEVEL_TILE_DEFS.unknown;
    }

    switch (tileChar) {
        case '.':
            spr = LEVEL_TILE_DEFS.floor;
            break;
        case 'w':
            spr = LEVEL_TILE_DEFS.wall;
            break;
        default:
            spr = LEVEL_TILE_DEFS.unknown;
            break;
    }
    return spr;
}

// 10x10 level represented as rows of characters: 'w' = wall, '.' = floor
export const LEVEL_TEMPLATE_TILES: string[] = [
  'wwwwwwwwww',
  'w........w',
  'w........w',
  'w........w',
  'w........w',
  'w........w',
  'w........w',
  'w........w',
  'w........w',
  'wwwwwwwwww',
];

export const LEVEL1_TILES: string[] = [
  'wwwwwwwwww',
  'w.w......w',
  'w........w',
  'w........w',
  'w........w',
  'w........w',
  'w........w',
  'w........w',
  'w........w',
  'wwwwwwwwww',
];
