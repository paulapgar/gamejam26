import { Animation, ImageSource, Loader, SpriteSheet } from "excalibur";

// It is convenient to put your RESOURCE in one place
export const RESOURCE = {
  Sword: new ImageSource("./images/sword.png"), // Vite public/ directory serves the root images
  spriteSheet: new ImageSource("./images/spritesheet.png"),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your RESOURCE.
// So when you type RESOURCE.Sword -> ImageSource

// We build a loader and add all of our RESOURCE to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(RESOURCE)) {
  loader.addResource(res);
}

const botRunningSheet = SpriteSheet.fromImageSource({
  image: RESOURCE.spriteSheet,
  grid: {
    rows: 1,
    columns: 3,
    spriteWidth: 40,
    spriteHeight: 40,
  },
});

export const runRightAnim = Animation.fromSpriteSheetCoordinates({
  spriteSheet: botRunningSheet,
  durationPerFrameMs: 250,
  frameCoordinates: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    { x: 2, y: 0 },
  ],
});
