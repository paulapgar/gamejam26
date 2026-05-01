import {
  Engine,
  Scene,
  SceneActivationContext,
  DefaultLoader,
  TileMap,
  Actor,
  Label,
  Rectangle,
  Color,
  FadeInOut,
  vec,
} from "excalibur";
import { ANIM, LEVEL_TILE_SPRITE, SOUNDS, gameFontWhite } from "./resources";
import { MyButton } from "./button";

const TILE_SIZE = 40;  // native sprite size
const COLUMNS = 10; // 10 * 40 * 2x scale = 800
const ROWS = 8;     // 8 * 40 * 2x scale = 640 > 600

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

const JUMP_INTERVAL = 80;

const BLUE_STOP_X = SCREEN_WIDTH / 2 + 120;
const RED_STOP_X   = SCREEN_WIDTH / 2 - 120;
const BOT_Y        = SCREEN_HEIGHT / 2 + 60;
const LABEL_Y      = BOT_Y - 190;

const DIALOG: ["blue" | "red", string[]][] = [
  ["blue", [
    "Woah!  Where did you come from??",
    "Do you have a name?",
  ]],
  ["red", [
    "I don't know where...",
    "But I'm pretty sure my name is Dopus!",
  ]],
  ["blue", [
    "My name is Gippity!",
    "Maybe we could train together!",
  ]],
  ["red", [
    "Sounds like fun...",
    "I'll try to keep up, buddy!",
  ]],
    ["red", [
    "",
  ]]
];

export class Cliffhanger extends Scene {
  private redBot!: Actor;
  private blueBot!: Actor;
  private exitButton!: MyButton;
  private redBotLastSoundX: number = 0;
  private blueBotLastSoundX: number = 0;
  private blueLabel!: Label;
  private redLabel!: Label;
  private tbcLabel!: Label;
  private dialogTimer!: Actor;

  override onInitialize(_engine: Engine): void {
    const tileMap = new TileMap({
      pos: vec(0, 0),
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
      rows: ROWS,
      columns: COLUMNS,
    });

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const tile = tileMap.getTile(col, row);
        if (!tile) continue;
        if (row >= 3 && row <= 5) {
          tile.addGraphic(LEVEL_TILE_SPRITE.floor);
        } else {
          tile.addGraphic(LEVEL_TILE_SPRITE.black);
        }
      }
    }

    this.add(tileMap);
    tileMap.scale = vec(2, 2);

    this.redBot = new Actor({ pos: vec(-80, SCREEN_HEIGHT / 2 + 60) });
    this.redBot.scale = vec(2, 2);
    this.redBot.graphics.use(ANIM.redBotRunRight);
    this.add(this.redBot);

    this.blueBot = new Actor({ pos: vec(SCREEN_WIDTH + 80, SCREEN_HEIGHT / 2 + 60) });
    this.blueBot.scale = vec(2, 2);
    this.blueBot.graphics.use(ANIM.botRunLeft);
    this.add(this.blueBot);

    const leftMask = new Actor({ pos: vec(-100, SCREEN_HEIGHT / 2 + 60), z: 1 });
    leftMask.graphics.use(new Rectangle({ width: 200, height: 100, color: Color.Black }));
    this.add(leftMask);

    const rightMask = new Actor({ pos: vec(SCREEN_WIDTH + 100, SCREEN_HEIGHT / 2 + 60), z: 1 });
    rightMask.graphics.use(new Rectangle({ width: 200, height: 100, color: Color.Black }));
    this.add(rightMask);

    const greenBar = new Actor({ pos: vec(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 40) });
    greenBar.graphics.use(new Rectangle({ width: 200, height: 80, color: Color.fromRGB(18, 56, 18) }));
    this.add(greenBar);

    this.exitButton = new MyButton(
      vec(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 40),
      LEVEL_TILE_SPRITE.button2,
      "Exit",
    );
    this.exitButton.setEnabled();
    this.exitButton.setVisible();
    this.exitButton.on("pointerup", () => {
      this.engine.goToScene("title", {
        destinationIn: new FadeInOut({
          duration: 1000,
          direction: "in",
          color: Color.Black,
        }),
      });
    });
    this.add(this.exitButton);

    this.blueLabel = new Label({ text: "", pos: vec(-1000, -1000), font: gameFontWhite });
    this.add(this.blueLabel);

    this.redLabel = new Label({ text: "", pos: vec(-1000, -1000), font: gameFontWhite });
    this.add(this.redLabel);

    this.tbcLabel = new Label({ text: "TO BE CONTINUED....?", pos: vec(-1000, -1000), font: gameFontWhite });
    this.add(this.tbcLabel);

    this.dialogTimer = new Actor();
    this.add(this.dialogTimer);
  }

  override onActivate(_context: SceneActivationContext<undefined>): void {
    this.redBot.pos = vec(-140, SCREEN_HEIGHT / 2 + 60);
    this.redBotLastSoundX = -100;
    this.redBot.graphics.use(ANIM.redBotRunRight);
    this.redBot.actions
      .moveTo(SCREEN_WIDTH / 2 - 120, SCREEN_HEIGHT / 2 + 60, 80)
      .callMethod(() => {
        this.redBot.graphics.use(ANIM.redBotStandRight);
        SOUNDS.jump2.play();
      });

    this.blueBot.pos = vec(SCREEN_WIDTH + 80, SCREEN_HEIGHT / 2 + 60);
    this.blueBotLastSoundX = SCREEN_WIDTH + 80;
    this.blueBot.graphics.use(ANIM.botRunLeft);
    this.blueBot.actions
      .moveTo(SCREEN_WIDTH / 2 + 120, SCREEN_HEIGHT / 2 + 60, 80)
      .callMethod(() => {
        this.blueBot.graphics.use(ANIM.botStandLeft);
      });

    // Reset dialog labels
    this.blueLabel.text = "";
    this.blueLabel.pos = vec(-1000, -1000);
    this.redLabel.text = "";
    this.redLabel.pos = vec(-1000, -1000);

    // Chain 4 dialog lines starting after both bots stop (~5.5s)
    this.dialogTimer.actions.clearActions();
    let chain = this.dialogTimer.actions.delay(5500);
    DIALOG.forEach(([speaker, text], i) => {
      chain = chain.callMethod(() => {
        this.blueLabel.pos = vec(-1000, -1000);
        this.redLabel.pos = vec(-1000, -1000);
        if (speaker === "blue") {
          this.blueLabel.text = text.join("\n");
          this.blueLabel.pos = vec(BLUE_STOP_X, LABEL_Y);
        } else {
          this.redLabel.text = text.join("\n");
          this.redLabel.pos = vec(RED_STOP_X, LABEL_Y);
        }
      });
      if (i < DIALOG.length - 1) {
        chain = chain.delay(5000);
      }
    });
    chain
      .delay(1000)
      .callMethod(() => {
        this.blueLabel.pos = vec(-1000, -1000);
        this.redLabel.pos = vec(-1000, -1000);
        this.tbcLabel.pos = vec(SCREEN_WIDTH / 2, 60);
      })
      .delay(5000)
      .callMethod(() => {
        this.tbcLabel.pos = vec(-1000, -1000);
        this.engine.goToScene("title", {
          destinationIn: new FadeInOut({
            duration: 1000,
            direction: "in",
            color: Color.Black,
          }),
        });
      });
  }

  override onPreLoad(_loader: DefaultLoader): void {
    // Add any scene-specific resources to the loader here
  }

  override onDeactivate(_context: SceneActivationContext<undefined>): void {
    this.dialogTimer.actions.clearActions();
    this.blueLabel.pos = vec(-1000, -1000);
    this.redLabel.pos = vec(-1000, -1000);
    this.tbcLabel.pos = vec(-1000, -1000);
  }

  override onPreUpdate(_engine: Engine, _elapsedMs: number): void {
    if (this.redBot.vel.x !== 0 && this.redBot.pos.x - this.redBotLastSoundX >= JUMP_INTERVAL) {
      SOUNDS.jump.play();
      this.redBotLastSoundX = this.redBot.pos.x;
    }
    if (this.blueBot.vel.x !== 0 && this.blueBotLastSoundX - this.blueBot.pos.x >= JUMP_INTERVAL) {
      SOUNDS.jump2.play();
      this.blueBotLastSoundX = this.blueBot.pos.x;
    }
  }

  override onPostUpdate(_engine: Engine, _elapsedMs: number): void {
    // Called after everything updates in the scene
  }
}
