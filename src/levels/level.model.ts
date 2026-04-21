import { Sprite } from "excalibur";
import { TileKind, TILE_DEFS, LEVEL_TILE_DEFS } from "../resources";

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
        case 'e':
            spr = LEVEL_TILE_DEFS.enter;
            break;
        case 'x':
            spr = LEVEL_TILE_DEFS.exit;
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
  'wew......w',
  'w.w......w',
  'w.www....w',
  'w........w',
  'w....w...w',
  'w....ww..w',
  'w.....w..w',
  'w.....w.xw',
  'wwwwwwwwww',
];
