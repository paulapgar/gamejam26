import {
  Actor,
  Color,
  Engine,
  FadeInOut,
  Label,
  Scene,
  SceneActivationContext,
  DefaultLoader,
  vec,
} from "excalibur";

import { ANIM, LEVEL_TILE_SPRITE, gameFontWhite, titleBkgSprite } from "./resources";
import { MyButton } from "./button";
import { LEVEL_DATA } from "./models/level.data";

export class TitleScene extends Scene {
  playButton!: MyButton;

  override onInitialize(_engine: Engine): void {
    // Called once when the scene is first initialized
    const background = new Actor({
      pos: vec(0, 0),
      anchor: vec(0, 0),
      width: 800,
      height: 600,
      z: -100,
    });
    background.graphics.use(titleBkgSprite);
    this.add(background);

    this.playButton = new MyButton(
      vec(400, 450),
      LEVEL_TILE_SPRITE.button4,
      "ENTER GAME",
    );
    this.playButton.setVisible();
    this.playButton.on("pointerup", () => {
      _engine.goToScene("level", {
        sceneActivationData: LEVEL_DATA["Level 1"],
        destinationIn: new FadeInOut({
          duration: 1000,
          direction: "in",
          color: Color.Black,
        }),
      });
    });
    this.add(this.playButton);

    const levelNumbers = ["1", "2", "3", "4", "5"];
    // 6 buttons × 50px spacing; first center = 400 - (5 * 50) / 2 = 275
    const btnStartX = 275;
    levelNumbers.forEach((num, i) => {
      const levelBtn = new MyButton(
        vec(btnStartX + i * 50, 520),
        LEVEL_TILE_SPRITE.button1,
        num,
      );
      levelBtn.setVisible();
      levelBtn.on("pointerup", () => {
        _engine.goToScene("level", {
          sceneActivationData: LEVEL_DATA[`Level ${num}`],
          destinationIn: new FadeInOut({
            duration: 1000,
            direction: "in",
            color: Color.Black,
          }),
        });
      });
      this.add(levelBtn);
    });

    const cliffBtn = new MyButton(
      vec(btnStartX + 5 * 50, 520),
      LEVEL_TILE_SPRITE.button1,
      "?",
    );
    cliffBtn.setVisible();
    cliffBtn.on("pointerup", () => {
      _engine.goToScene("cliffhanger", {
        destinationIn: new FadeInOut({
          duration: 1000,
          direction: "in",
          color: Color.Black,
        }),
      });
    });
    this.add(cliffBtn);

    const titleBot = new Actor({
      pos: vec(150, 200),
      width: 40,
      height: 40,
      scale: vec(8, 8),
    });
    titleBot.graphics.use(ANIM.botDance);
    this.add(titleBot);

    const byLabel = new Label({
      text: "By Paul Apgar",
      pos: vec(150, 360),
      font: gameFontWhite,
    });
    this.add(byLabel);
    const jamLabel = new Label({
      text: "for GameDev.js Jam 2026",
      pos: vec(150, 380),
      font: gameFontWhite,
    });
    this.add(jamLabel);


  }

  override onPreLoad(_loader: DefaultLoader): void {
    // Add any scene-specific resources to the loader here
  }

  override onActivate(_context: SceneActivationContext<undefined>): void {
    // Called each time the scene becomes active
  }

  override onDeactivate(_context: SceneActivationContext<undefined>): void {
    // Called each time the scene becomes inactive
  }

  override onPreUpdate(_engine: Engine, _elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  override onPostUpdate(_engine: Engine, _elapsedMs: number): void {
    // Called after everything updates in the scene
  }
}
