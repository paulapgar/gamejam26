import { Animation, ImageSource, Loader, SpriteSheet, Sprite } from "excalibur";

// It is convenient to put your RESOURCE in one place
export const RESOURCES = {
  spriteSheet: new ImageSource("./images/spritesheet.png"),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your RESOURCE.
// So when you type RESOURCE.Sword -> ImageSource

// We build a loader and add all of our RESOURCE to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(RESOURCES)) {
  loader.addResource(res);
}

const mainSheet = SpriteSheet.fromImageSource({
  image: RESOURCES.spriteSheet,
  grid: {
    rows: 15,
    columns: 20,
    spriteWidth: 40,
    spriteHeight: 40,
  },
});

export const animRunRight = Animation.fromSpriteSheetCoordinates({
  spriteSheet: mainSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    { x: 2, y: 0 },
  ],
});

export const animRunLeft = Animation.fromSpriteSheetCoordinates({
  spriteSheet: mainSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 5, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 3, y: 0 },
  ],
});

export const animStandLeft = Animation.fromSpriteSheetCoordinates({
  spriteSheet: mainSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 5, y: 0 },
  ],
});

export const animStandRight = Animation.fromSpriteSheetCoordinates({
  spriteSheet: mainSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 0, y: 0 },
  ],
});


// Tile definitions consolidated into a single registry
export type TileKind = 'floor' | 'wall1' | 'start' | 'exit';

export interface TileDef {
  kind: TileKind;
  passable: boolean;
  sprite: Sprite;
  isStart?: boolean;
  isExit?: boolean;
  metadata?: Record<string, unknown>;
}

export const TILE_DEFS: Record<TileKind, TileDef> = {
  floor: { kind: 'floor', passable: true,  sprite: mainSheet.getSprite(0, 2) },
  wall1: { kind: 'wall1', passable: false, sprite: mainSheet.getSprite(1, 2) },
  start: { kind: 'start', passable: true,  sprite: mainSheet.getSprite(1, 3), isStart: true },
  exit:  { kind: 'exit',  passable: true,  sprite: mainSheet.getSprite(0, 3), isExit: true },
};

export const BKG_TILE_DEFS: Record<string, Sprite> = {
  topLeftBorder: mainSheet.getSprite(0,4),
  topRightBorder: mainSheet.getSprite(1,4),
  bottomLeftBorder: mainSheet.getSprite(0,5),
  bottomRightBorder: mainSheet.getSprite(1,5),
  topBorder: mainSheet.getSprite(2,4),
  bottomBorder: mainSheet.getSprite(2,5),
  leftBorder: mainSheet.getSprite(0,6),
  rightBorder: mainSheet.getSprite(1,6),
  rightT: mainSheet.getSprite(3,6),
  leftT: mainSheet.getSprite(2,6),
  middleHorizontal: mainSheet.getSprite(3,4),
  unknown: mainSheet.getSprite(0,7),
  black: mainSheet.getSprite(1,7),
}

export const LEVEL_TILE_DEFS: Record<string, Sprite> = {
  floor: mainSheet.getSprite(0,2),
  wall: mainSheet.getSprite(1,2),
  exit: mainSheet.getSprite(0,3),
  enter: mainSheet.getSprite(1,3),
  unknown: mainSheet.getSprite(0,7),
  black: mainSheet.getSprite(1,7),
}
