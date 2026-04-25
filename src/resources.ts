import {
  Animation,
  ImageSource,
  Loader,
  SpriteSheet,
  Sprite,
  FontSource,
  Color,
  vec,
  AnimationStrategy,
} from "excalibur";

// It is convenient to put your RESOURCE in one place
export const RESOURCES = {
  spriteSheet: new ImageSource("./images/spritesheet.png"),
  background: new ImageSource("./images/background.png"),
  fontRetroGaming: new FontSource("./fonts/Retro Gaming.ttf", "Retro"),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your RESOURCE.
// So when you type RESOURCE.Sword -> ImageSource

// We build a loader and add all of our RESOURCE to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(RESOURCES)) {
  loader.addResource(res);
}

export const gameFont = RESOURCES.fontRetroGaming.toFont({
  family: "Retro",
  color: Color.fromRGB(48, 136, 17, 255),
  size: 16,
  shadow: {
    offset: vec(4, 4),
    color: Color.Black,
  },
});

export const bkgSprite = Sprite.from(RESOURCES.background);

const mainSheet = SpriteSheet.fromImageSource({
  image: RESOURCES.spriteSheet,
  grid: {
    rows: 15,
    columns: 20,
    spriteWidth: 40,
    spriteHeight: 40,
  },
});

export const ANIM = {
  botRunRight: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ],
  }),
  botRunLeft: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [
      { x: 5, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 3, y: 0 },
    ],
  }),
  botRunUp: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 6, y: 0 },
      { x: 8, y: 0 },
    ],
  }),
  botRunDown: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [
      { x: 11, y: 0 },
      { x: 10, y: 0 },
      { x: 11, y: 0 },
      { x: 9, y: 0 },
    ],
  }),
  botDance: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [
      { x: 11, y: 0 },
      { x: 12, y: 0 },
      { x: 11, y: 0 },
      { x: 13, y: 0 },
    ],
  }),
  botStandLeft: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [{ x: 5, y: 0 }],
  }),
  botStandRight: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [{ x: 0, y: 0 }],
  }),
  botStandUp: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [{ x: 6, y: 0 }],
  }),
  botStandDown: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [{ x: 11, y: 0 }],
  }),
  botDying: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 100,
    strategy: AnimationStrategy.Freeze,
    // Spin around and lay down
    frameCoordinates: [
      { x: 1, y: 0 },
      { x: 7, y: 0 },
      { x: 4, y: 0 },
      { x: 10, y: 0 },
      { x: 1, y: 0 },
      { x: 7, y: 0 },
      { x: 4, y: 0 },
      { x: 10, y: 0 },
      { x: 14, y: 0 },
    ]}),
  shockTile1: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 250,
    frameCoordinates: [
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
    ],  
  }),
  shockTile2: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 225,
    frameCoordinates: [
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
    ],  
  }),
  shockTile3: Animation.fromSpriteSheetCoordinates({
    spriteSheet: mainSheet,
    durationPerFrameMs: 200,
    frameCoordinates: [
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
    ],  
  }),
};

export const LEVEL_TILE_SPRITE = {
  floor: mainSheet.getSprite(0, 2),
  wall: mainSheet.getSprite(1, 2),
  exit: mainSheet.getSprite(0, 3),
  enter: mainSheet.getSprite(1, 3),
  unknown: mainSheet.getSprite(0, 7),
  black: mainSheet.getSprite(1, 7),
  tokentray: mainSheet.getSprite(2, 7),
  tokenactive: mainSheet.getSprite(3, 7),
};

export const TOKEN_SPRITE = {
  fwd: mainSheet.getSprite(1, 8),
  fwd2: mainSheet.getSprite(2, 8),
  fwd3: mainSheet.getSprite(3, 8),
  fwd4: mainSheet.getSprite(4, 8),
  bck: mainSheet.getSprite(1, 9),
  bck2: mainSheet.getSprite(2, 9),
  bck3: mainSheet.getSprite(3, 9),
  bck4: mainSheet.getSprite(4, 9),
  tr: mainSheet.getSprite(5, 8),
  tl: mainSheet.getSprite(6, 8),
  pu: mainSheet.getSprite(7, 8),
  pd: mainSheet.getSprite(8, 8),
  use: mainSheet.getSprite(9, 8),
  unknown: mainSheet.getSprite(0, 7),
};
