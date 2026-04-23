import { Animation, ImageSource, Loader, SpriteSheet, Sprite, FontSource, Color, vec } from "excalibur";

// It is convenient to put your RESOURCE in one place
export const RESOURCES = {
  spriteSheet: new ImageSource("./images/spritesheet.png"),
  background: new ImageSource("./images/background.png"),
  fontRetroGaming: new FontSource("./fonts/Retro Gaming.ttf", "Retro")
} as const; // the 'as const' is a neat typescript trick to get strong typing on your RESOURCE.
// So when you type RESOURCE.Sword -> ImageSource

// We build a loader and add all of our RESOURCE to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(RESOURCES)) {
  loader.addResource(res);
}

export const gameFont = RESOURCES.fontRetroGaming.toFont({
  family: 'Retro',
  color: Color.White,
  size: 16,
  shadow: {
    offset: vec(4,4),
    color: Color.Black
  }
});

export const bkgSprite = Sprite.from(RESOURCES.background)

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

export const animRunUp = Animation.fromSpriteSheetCoordinates({
  spriteSheet: mainSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 6, y: 0 },
    { x: 7, y: 0 },
    { x: 6, y: 0 },
    { x: 8, y: 0 },
  ],
});

export const animRunDown = Animation.fromSpriteSheetCoordinates({
  spriteSheet: mainSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 11, y: 0 },
    { x: 10, y: 0 },
    { x: 11, y: 0 },
    { x: 9, y: 0 },
  ],
});

export const animDance = Animation.fromSpriteSheetCoordinates({
  spriteSheet: mainSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 11, y: 0 },
    { x: 12, y: 0 },
    { x: 11, y: 0 },
    { x: 13, y: 0 },
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

export const animStandUp = Animation.fromSpriteSheetCoordinates({
  spriteSheet: mainSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 6, y: 0 },
  ],
});

export const animStandDown = Animation.fromSpriteSheetCoordinates({
  spriteSheet: mainSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 11, y: 0 },
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

export const LEVEL_TILE_SPRITE: Record<string, Sprite> = {
  "floor": mainSheet.getSprite(0,2),
  "wall": mainSheet.getSprite(1,2),
  "exit": mainSheet.getSprite(0,3),
  "enter": mainSheet.getSprite(1,3),
  "unknown": mainSheet.getSprite(0,7),
  "black": mainSheet.getSprite(1,7),
  "tokentray": mainSheet.getSprite(2,7),
  "tokenactive": mainSheet.getSprite(3,7),
}

export const TOKEN_SPRITE: Record<string, Sprite> = {
  "fwd": mainSheet.getSprite(1,8),
  "fwd2": mainSheet.getSprite(2,8),
  "fwd3": mainSheet.getSprite(3,8),
  "fwd4": mainSheet.getSprite(4,8),
  "tr": mainSheet.getSprite(5,8),
  "tl": mainSheet.getSprite(6,8),
}