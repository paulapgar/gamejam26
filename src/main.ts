import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { MyLevel } from "./level";
import { TitleScene } from "./title";
import { Cliffhanger } from "./cliffhanger";

// Goal is to keep main.ts small and just enough to configure the engine

const game = new Engine({
  width: 800, // Logical width and height in game pixels
  height: 600,
  //displayMode: DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
  displayMode: DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  pixelRatio: 1,
  backgroundColor: Color.Black,
  scenes: {
    title: TitleScene,
    level: MyLevel,
    cliffhanger: Cliffhanger,
  },
});

// name of the start scene 'start'
game.start('root', {
  loader, // Optional loader (but needed for loading images/sounds)
}).then(() => {
  game.goToScene('title', {
    destinationIn: new FadeInOut({
      duration: 1000,
      direction: 'in',
      color: Color.Black
    })
  });
});