import {
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Scene,
  SceneActivationContext,
  vec,
  TileMap,
  Actor,
  Vector,
  randomIntInRange,
  Label,
  Color,
  FadeInOut,
} from "excalibur";

import {
  ANIM,
  LEVEL_TILE_SPRITE,
  bkgSprite,
  gameFontWhite,
  gameFontWhiteLeft,
  gameFontGreen,
} from "./resources";

import {
  getTileChar,
  getLevelTileSprite,
  LevelData,
} from "./models/level.model";

import { Bot } from "./bot";
import { Token } from "./token";
import { TOKEN_DATA } from "./models/token.data";
import { TokenType } from "./models/token.model";
import { MyButton } from "./button";
import { LEVEL_DATA } from "./models/level.data";

const BKG_Z = -100; // Background sprite Z
const TILE_Z = -50; // Tilemap Z
const INST_Z = 10; // Instruction background Z (text/sprite+1)

const tileSize = 40;
const tileMapOffset = vec(60, 60); // the middle of tile (0,0)
const contextWindowOffset = vec(494, 546);

export class MyLevel extends Scene {
  levelTileMap!: TileMap;
  myLevelData!: LevelData;
  bot: Bot = new Bot();
  levelMode: "intro" | "paused" | "playing" | "running" | "won" | "lost" =
    "intro";
  fallingTokens: Token[] = [];
  tokenBucket: TokenType[] = [];
  dropFallingToken: boolean = false;
  contextWindowMaxSize: number = 30;
  contextWindowActors: Actor[] = [];

  instructionsBkg!: Actor;
  computeLabel!: Label;

  tokenTray: Token[] = [];
  tokenTraySize: number = 0;
  tokenTrayActive: number = -1; // index of active token in the tray or -1 if no active token
  tokenTrayActiveOverlay!: Actor; // overlay Actor to show the token graphic of the active token in the tray

  startLevelButton!: MyButton;
  restartLevelButton!: MyButton;
  nextLevelButton!: MyButton;
  pauseLevelButton!: MyButton;
  resumeLevelButton!: MyButton;
  exitLevelButton!: MyButton;
  executePlanButton!: MyButton;

  getAvailableTokenTrayIndex(): number {
    for (let i = 0; i < this.myLevelData.numTokens; i++) {
      if (this.tokenTray[i].mode === "unused") {
        return i;
      }
    }
    return -1; // no available slot
  }

  getNextTileInDirection(pos: Vector, facing: string): Vector {
    switch (facing) {
      case "Up":
        return vec(pos.x, pos.y - 1);
      case "Down":
        return vec(pos.x, pos.y + 1);
      case "Left":
        return vec(pos.x - 1, pos.y);
      case "Right":
        return vec(pos.x + 1, pos.y);
      default:
        return pos;
    }
  }

  getNextTileInDirectionBackwards(pos: Vector, facing: string): Vector {
    switch (facing) {
      case "Up":
        return vec(pos.x, pos.y + 1);
      case "Down":
        return vec(pos.x, pos.y - 1);
      case "Left":
        return vec(pos.x + 1, pos.y);
      case "Right":
        return vec(pos.x - 1, pos.y);
      default:
        return pos;
    }
  }

  // Return true if the bot should not continue with the next command (e.g. because it reached the exit or died on a deadly tile)
  evaluateActionForCurrentTile(bot: Bot): boolean {
    const tileType = this.getTileType(bot.currentTile);
    switch (tileType) {
      case "exit":
        bot.setMoveWinning();
        return true;
        break;
      case "deadly":
        bot.setMoveDying();
        return true;
        break;
    }
    return false;
  }

  runCommandStep(bot: Bot) {
    if (bot.isMoving()) return; // wait until bot is done with current move

    if (bot.isDying()) {
      if (this.levelMode !== "lost") {
        this.levelMode = "lost";
      }
      return;
    }

    if (bot.isWinning()) {
      if (this.levelMode !== "won") {
        this.setLevelMode("won");
      }
      return;
    }

    // Check the bot's current tile and decide what to do based on that and the next command in the bot's queue
    if (this.evaluateActionForCurrentTile(bot)) return;

    // If no environment changes to the bot occur, evaluate the next move
    // This is where the main logic for executing the bot's commands is
    if (this.tokenTrayActive < 0) {
      this.tokenTrayActive = 0;
      this.tokenTrayActiveOverlay.pos =
        this.tokenTray[this.tokenTrayActive].pos;
    }
    let cmd = this.tokenTray[this.tokenTrayActive].pullNextCommand();
    if (!cmd) {
      this.tokenTrayActive++;
      if (this.tokenTrayActive >= this.tokenTray.length) {
        this.tokenTrayActive = -1; // no more commands to execute
        // die when running out of commands if above check for current tile exit fails
        bot.setMoveDying();
        this.levelMode = "lost";
      } else {
        // update the position of the active token in the tray
        this.tokenTrayActiveOverlay.pos =
          this.tokenTray[this.tokenTrayActive].pos;
      }
    } else {
      let nextTile: Vector;
      let tileType: string;
      switch (cmd) {
        case "fwd":
          nextTile = this.getNextTileInDirection(bot.currentTile, bot.facing);
          tileType = this.getTileType(nextTile);
          if (tileType === "blocked") {
            // don't update targetTile
            bot.setMoveBlocked();
          } else {
            bot.targetTile = nextTile;
            bot.setMoveForward();
          }
          break;
        case "bck":
          nextTile = this.getNextTileInDirectionBackwards(
            bot.currentTile,
            bot.facing,
          );
          tileType = this.getTileType(nextTile);
          if (tileType === "blocked") {
            // don't update targetTile
            bot.setMoveBlocked();
          } else {
            bot.targetTile = nextTile;
            bot.setMoveForward();
          }
          break;
        case "tr":
          bot.turnRight();
          break;
        case "tl":
          bot.turnLeft();
          break;
      }
    }
  }

  getTileScreenVec(tilePos: Vector): Vector {
    return vec(
      tilePos.x * tileSize + tileMapOffset.x,
      tilePos.y * tileSize + tileMapOffset.y,
    );
  }

  getTileType(tilePos: Vector): string {
    const tileRef = this.levelTileMap.getTile(tilePos.x, tilePos.y);
    if (tileRef) {
      return tileRef.data.get("type");
    } else {
      console.log("Error: getTileType, tileRef not found for pos", tilePos);
      return ""; // out of bounds
    }
  }

  setTileType(tilePos: Vector, type: string): void {
    const tileRef = this.levelTileMap.getTile(tilePos.x, tilePos.y);
    if (tileRef) {
      tileRef.data.set("type", type);
    } else {
      console.log("Error: setTileType, tileRef not found for pos", tilePos);
    }
  }

  startNewFallingToken() {
    if (this.tokenBucket.length === 0) {
      return;
    } else {
      const tokenType = this.tokenBucket.shift()!;
      // Should always have one at this point
      if (tokenType) {
        const token = new Token();
        token.graphics.use(TOKEN_DATA[tokenType].graphic);
        token.fallingColumn = randomIntInRange(0, 2);
        token.pos = vec(500 + token.fallingColumn * 40, 20);
        token.graphics.opacity = 0;
        token.mode = "falling";
        token.clickable = false;
        token.tokenType = tokenType;
        this.add(token);
        this.fallingTokens.push(token);
        token.tokenEvents.on("tokenfalling-clicked", (clickedToken) => {
          this.onFallingTokenClicked(clickedToken);
        });
        token.actions
          .moveTo(vec(500 + token.fallingColumn * 40, 60), 40)
          .callMethod(() => {
            // Set a flag to spawn another token as soon as this one
            // has reached a certain spot.  Done in onPreUpdate() for the level scene
            this.dropFallingToken = true;
            token.clickable = true;
          })
          .moveTo(vec(500 + token.fallingColumn * 40, 400), 40)
          .callMethod(() => {
            token.clickable = false;
          })
          .moveTo(vec(500 + token.fallingColumn * 40, 420), 40)
          .callMethod(() => {
            token.mode = "unused";
            token.pos = vec(-100, -100); // move off screen until we can reuse in tray
            // Add a new actor to fill up the Context Window
            // ****
            this.addContextWindowActor();
          });
      } else {
        console.log("Error: getNewFallingToken, tokenType not found in bucket");
        return;
      }
    }
  }

  findTokenInTray(token: Token): number {
    for (let i = 0; i < this.tokenTray.length; i++) {
      if (this.tokenTray[i] === token) {
        return i;
      }
    }
    return -1; // not found
  }

  onTrayTokenClicked(token: Token) {
    if (this.levelMode === "playing") {

    const tokenNum = this.findTokenInTray(token);
    if (tokenNum != -1) {
      // remove the token from the tray
      token.tokenType = "";
      token.mode = "unused";
      token.tokenCommands = [];
      token.removeAllChildren();
    } else {
      console.log("Error: onTrayTokenClicked, token not found in tray");
    }
  }
  }

  onFallingTokenClicked(token: Token) {
    console.log("Falling token clicked:", token.tokenType);
    if (token.clickable === true) {
      let tokenNum = this.getAvailableTokenTrayIndex();
      console.log("Available token tray index:", tokenNum);
      if (tokenNum != -1) {
        this.tokenTray[tokenNum].tokenType = token.tokenType;
        this.tokenTray[tokenNum].mode = "placed";
        this.tokenTray[tokenNum].tokenCommands = [
          ...TOKEN_DATA[token.tokenType].commands,
        ];
        const tokenOverlay = new Actor({ pos: vec(0, 0) });
        tokenOverlay.graphics.use(TOKEN_DATA[token.tokenType].graphic);
        this.tokenTray[tokenNum].addChild(tokenOverlay);
        // subscribe to tray click for this slot
        this.tokenTray[tokenNum].tokenEvents.on(
          "tokentray-clicked",
          (clickedToken) => {
            this.onTrayTokenClicked(clickedToken);
          },
        );
        // token data copied move the falling token away
        token.clickable = false;
        token.mode = "unused";
        token.pos = vec(-100, -100); // move off screen until we can reuse in tray
        token.actions.clearActions(); // stop any ongoing actions (like falling)
      }
    }

    // TODO: add token to tray
  }

  runPlayingStep() {
    if (this.dropFallingToken) {
      this.startNewFallingToken();
      this.dropFallingToken = false;
    }
  }

  getContextWindowAmount(): number {
    return this.contextWindowActors.length;
  }

  addContextWindowActor(): void {
    if (this.contextWindowActors.length >= this.contextWindowMaxSize) {
      // Context Window is full, don't add more
      // **** FORCE the game to switch to "running" mode when this happens and start auto executing the bot's commands with a delay between each step until the end of the context window is reached, then switch back to "playing" mode and allow the player to add more commands to the tray
      this.setLevelMode("running");
      return;
    } else {
      const spr = randomIntInRange(1, 4);
      const contextActor = new Actor({
        pos: vec(
          contextWindowOffset.x + (this.contextWindowActors.length % 10) * 28,
          contextWindowOffset.y -
            Math.floor(this.contextWindowActors.length / 10) * 26,
        ),
        width: 30,
        height: 30,
        opacity: 0,
        rotation: Math.random() * 180,
        scale: vec(0.75, 0.75),
        // *****  ?? for some reason need to typecast here to avoid a TS error about the keys of LEVEL_TILE_SPRITE
        graphic:
          LEVEL_TILE_SPRITE[
            ("contextWindow" + spr) as keyof typeof LEVEL_TILE_SPRITE
          ],
      });
      contextActor.actions.fade(1, 500);
      this.contextWindowActors.push(contextActor);
      this.add(contextActor);
    }
  }

  updateCompute(compute:number): void {
    this.computeLabel.text = `Compute Power (${compute} TOPS)`;
    this.myLevelData.numTokens = compute;
  }

  setLevelMode(
    mode: "intro" | "paused" | "playing" | "running" | "won" | "lost",
  ) {
    switch (mode) {
      case "intro":
        // intro is handled entirely by onActivate() for the level, so no need to do anything here
        break;
      case "playing":
        // hide instructions and start dropping tokens
        this.dropFallingToken = true;
        this.instructionsBkg.pos = vec(-1000, -1000); // move off screen
        // replace button with Execute Plan button
        this.startLevelButton.setHidden();
        this.executePlanButton.setVisible();
        this.restartLevelButton.setEnabled();
        break;
      case "running":
        // stop dropping tokens, make the falling tokens disappear, and start executing the bot's commands in the tray
        // clean out falling tokens
        for (const token of this.fallingTokens) {
          token.clickable = false;
          token.actions.clearActions();
          token.actions.fade(0, 500).callMethod(() => {
            token.actions.die();
          });
        }
        this.fallingTokens = [];
        // **** add some visual indication that the bot is now executing the commands in the tray
        this.executePlanButton.setDisabled(); // disable the button while running
        break;
      case "won":
        // show winning message and button to go to next level if there is one
        // Swap out the restart button for a Next button
        this.restartLevelButton.setHidden();
        this.nextLevelButton.setVisible();
        break;
      case "lost":
        // show losing message and button to restart level
        break;
      case "paused":
        // show instructions with instructionsBkg and hide the tilemap and token tray
        break;
    }
    this.levelMode = mode;
  }

  cleanLevel() {
    // clean out the token tray
    for (const token of this.tokenTray) {
      for (const child of token.children) {
        token.removeChild(child);
      }
      token.mode = "unused";
      token.tokenCommands = [];
      token.tokenType = "";
    }

    this.contextWindowActors.forEach((actor) => {
      this.remove(actor);
    });
    this.contextWindowActors = [];

    // clean out falling tokens
    for (const token of this.fallingTokens) {
      token.actions.clearActions();
      this.remove(token);
    }
    this.fallingTokens = [];
  }

  //////////////////////////////////////////////////////////////////////////////
  // Excalibur lifecycle methods

  override onInitialize(_engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game
    //const player = new Player();
    //this.add(player); // Actors need to be added to a scene to be drawn

    this.bot = new Bot();
    this.add(this.bot);
    this.bot.setAnimation();

    // add background sprite as an Actor at pos(0,0) with anchor(0,0)
    const background = new Actor({
      pos: vec(0, 0),
      anchor: vec(0, 0),
      width: 800,
      height: 600,
      z: BKG_Z,
    });
    background.graphics.use(bkgSprite);
    this.add(background);

    this.instructionsBkg = new Actor({
      pos: vec(-1000, -1000), // start off screen until we set it properly in onActivate
      width: 400,
      height: 400,
      anchor: vec(0, 0),
      color: Color.fromRGB(52, 81, 111, 1),
      z: INST_Z,
    });
    this.add(this.instructionsBkg);

    // Create a 10x10 TileMap, is filled in by onActivate based on LevelData passed in
    this.levelTileMap = new TileMap({
      pos: vec(tileSize * 1, tileSize * 1),
      tileWidth: tileSize,
      tileHeight: tileSize,
      rows: 10,
      columns: 10,
    });
    this.add(this.levelTileMap);
    this.levelTileMap.z = TILE_Z;

    // Initialize the token tray with Actors for the spaces
    for (let i = 0; i < 20; i++) {
      this.tokenTray[i] = new Token();
      this.tokenTray[i].graphics.use(LEVEL_TILE_SPRITE.black);
      this.tokenTray[i].pos = vec(-100, -100); // start off screen until we set them properly in onActivate
      this.tokenTray[i].z = TILE_Z;
      this.tokenTray[i].mode = "unused";
      this.add(this.tokenTray[i]);
    }

    this.tokenTrayActiveOverlay = new Actor({ pos: vec(-100, -100) });
    this.tokenTrayActiveOverlay.graphics.use(LEVEL_TILE_SPRITE.tokenactive);
    this.tokenTrayActiveOverlay.z = TILE_Z + 10; // make sure it is above the token tray spaces
    this.add(this.tokenTrayActiveOverlay);

    const tokenLabel = new Label({
      text: "Tokens",
      pos: vec(535, 20),
      font: gameFontGreen,
    });
    this.add(tokenLabel);

    const contextLabel = new Label({
      text: "Context Window (-% Bonus)",
      pos: vec(620, 460),
      font: gameFontGreen,
    });
    this.add(contextLabel);

    const agentLabel = new Label({
      text: "Agent",
      pos: vec(700, 20),
      font: gameFontGreen,
    });
    this.add(agentLabel);

    const harnessLabel = new Label({
      text: "Agentic Testing Harness",
      pos: vec(240, 20),
      font: gameFontGreen,
    });
    this.add(harnessLabel);

    this.computeLabel = new Label({
      text: "Compute Power ( )",
      pos: vec(240, 560),
      font: gameFontGreen,
    });
    this.add(this.computeLabel);
  }

  override onPreLoad(_loader: DefaultLoader): void {
    // Add any scene specific RESOURCE to load
  }

  override onActivate(context: SceneActivationContext<LevelData>): void {
    // Called when Excalibur transitions to this scene
    // Only 1 scene is active at a time

    // Some initializing logic
    this.tokenTrayActive = -1;
    this.levelMode = "intro";
    this.dropFallingToken = false;
    this.tokenTrayActiveOverlay.pos = vec(-100, -100); // move off screen until we have an active token running

    this.myLevelData = context.data!;

    // init the available tokens for this level
    this.tokenBucket = [...this.myLevelData.tokenList];
    this.updateCompute(this.myLevelData.numTokens);


    this.bot.moving = false;
    this.bot.dying = false;
    this.bot.winning = false;
    this.bot.setFacing(this.myLevelData.botFacing);
    this.bot.setAnimation();

    // This is going to load the level based on what level is passed in the context
    for (let ty = 0; ty < 10; ty++) {
      for (let tx = 0; tx < 10; tx++) {
        // Should always work, we are within bounds...
        const tileRef = this.levelTileMap.getTile(tx, ty);

        if (tileRef) {
          let tileChar = getTileChar(this.myLevelData.charMap, tx, ty);
          // Clear out special data on tile since this TileMap is reused each level

          tileRef.data.clear();
          switch (tileChar) {
            // 'e'ntrance
            case "e":
              this.bot.currentTile = vec(tx, ty);
              this.bot.pos = this.getTileScreenVec(this.bot.currentTile);
              tileRef.addGraphic(getLevelTileSprite(tileChar));
              break;
            case " ":
              tileRef.addGraphic(getLevelTileSprite(tileChar));
              break;
            case ".":
              tileRef.addGraphic(getLevelTileSprite(tileChar));
              break;
            case "w":
              this.setTileType(vec(tx, ty), "blocked");
              tileRef.addGraphic(getLevelTileSprite(tileChar));
              break;
            case "x":
              this.setTileType(vec(tx, ty), "exit");
              tileRef.data.set("type", "exit");
              tileRef.addGraphic(getLevelTileSprite(tileChar));
              break;
            case "z":
              this.setTileType(vec(tx, ty), "deadly");
              const zapSpeed = randomIntInRange(1, 3);
              switch (zapSpeed) {
                case 1:
                  tileRef.addGraphic(ANIM.shockTile1);
                  break;
                case 2:
                  tileRef.addGraphic(ANIM.shockTile2);
                  break;
                default:
                  tileRef.addGraphic(ANIM.shockTile3);
              }
              break;
            case "d":
              this.setTileType(vec(tx, ty), "blocked");
              tileRef.addGraphic(LEVEL_TILE_SPRITE.door);
              break;
            default:
              break;
          }
        }
      }
    }

    for (let i = 0; i < 20; i++) {
      this.tokenTray[i].graphics.use(LEVEL_TILE_SPRITE.black);
      this.tokenTray[i].pos = vec(-100, -100); // start off screen until we set them properly below
      this.tokenTray[i].z = TILE_Z;
    }

    // Now we build up the tray based on the numTokens for the level.
    // Row 1 (indices 0–9)  — only shown when numTokens > 10
    // Row 2 (indices 10–19) — or row 1 when numTokens <= 10
    let j = 12;
    let row = 0;
    if (this.myLevelData.numTokens > 10) {
      for (let i = 0; i < 10; i++) {
        this.tokenTray[i].graphics.use(LEVEL_TILE_SPRITE.tokentray);
        this.tokenTray[i].pos = vec(i * 40 + 60, j * 40 + 20);
        this.tokenTray[i].z = TILE_Z;
      }
      j++;
      row++;
    }
    // Second row (or only row when numTokens <= 10)
    for (let i = row * 10; i < this.myLevelData.numTokens; i++) {
      this.tokenTray[i].graphics.use(LEVEL_TILE_SPRITE.tokentray);
      this.tokenTray[i].pos = vec((i - row * 10) * 40 + 60, j * 40 + 20);
      this.tokenTray[i].z = TILE_Z;
    }

    // onActivate we can assume it is at intro mode so set up the instructions
    this.instructionsBkg.removeAllChildren();
    this.instructionsBkg.pos = vec(40, 40);
    const instructionsTitle = new Label({
      text: "instructions.md",
      pos: vec(200, 5),
      font: gameFontWhite,
    });
    this.instructionsBkg.addChild(instructionsTitle);

    const instructionsLabel = new Label({
      text: this.myLevelData.instructionText.join("\n"),
      pos: vec(5, 160),
      font: gameFontWhiteLeft,
    });
    this.instructionsBkg.addChild(instructionsLabel);

    const instructionsIcon = new Actor({
      pos: vec(200, 70),
      width: 40,
      height: 40,
      scale: vec(2, 2),
    });
    instructionsIcon.graphics.use(this.myLevelData.instructionIcon);
    this.instructionsBkg.addChild(instructionsIcon);

    const instructionsIconText = new Label({
      text: this.myLevelData.instructionIconText,
      pos: vec(200, 110),
      font: gameFontWhite,
    });
    this.instructionsBkg.addChild(instructionsIconText);

    const agentLabel = new Label({
      text: `Gippity\nVer: 0.0.0.1\nExp: 0\n${this.myLevelData.name}`,
      pos: vec(640, 40),
      font: gameFontWhiteLeft,
    });
    this.add(agentLabel);

    this.startLevelButton = new MyButton(
      vec(240, 460),
      LEVEL_TILE_SPRITE.button4,
      "Start Level",
    );
    this.startLevelButton.setVisible();
    this.startLevelButton.on("pointerup", () => {
      this.setLevelMode("playing");
    });
    this.add(this.startLevelButton);

    this.executePlanButton = new MyButton(
      vec(240, 460),
      LEVEL_TILE_SPRITE.button4,
      "Execute Plan",
    );
    this.executePlanButton.on("pointerup", () => {
      if (this.levelMode === "playing") {
        this.setLevelMode("running");
      }
    });
    this.add(this.executePlanButton);

    this.restartLevelButton = new MyButton(
      vec(17.5 * 40, 200),
      LEVEL_TILE_SPRITE.button4,
      "Restart Level",
    );
    this.restartLevelButton.setVisible();
    this.restartLevelButton.setDisabled();
    this.restartLevelButton.on("pointerup", () => {
      if (this.levelMode !== "intro") {
        this.setLevelMode("intro");
        this.cleanLevel();
        this.onActivate(context); // re-run the onActivate logic to reset the level
      }
    });
    this.add(this.restartLevelButton);

    this.nextLevelButton = new MyButton(
      vec(17.5 * 40, 200),
      LEVEL_TILE_SPRITE.button4,
      "Next Level",
    );
    this.nextLevelButton.on("pointerup", () => {
      if (this.myLevelData.nextLevel) {
        if (LEVEL_DATA[this.myLevelData.nextLevel].levelType === "puzzle") {
          this.engine.goToScene("level", {
            sceneActivationData: LEVEL_DATA[this.myLevelData.nextLevel],
            destinationIn: new FadeInOut({
              duration: 1000,
              direction: "in",
              color: Color.Black,
            }),
          });
        } else {
          // Non puzzle levels could be a cutscene
          if (this.myLevelData.nextLevel === "Title") {
            this.engine.goToScene("title", {
              destinationIn: new FadeInOut({
                duration: 1000,
                direction: "in",
                color: Color.Black,
              }),
            });
          }
        }
      }
    });
    this.add(this.nextLevelButton);

    this.exitLevelButton = new MyButton(
      vec(17.5 * 40, 200),
      LEVEL_TILE_SPRITE.button4,
      "Exit to Menu",
    );
    this.exitLevelButton.on("pointerup", () => {
      this.engine.goToScene("title", {
        destinationIn: new FadeInOut({
          duration: 1000,
          direction: "in",
          color: Color.Black,
        }),
      });
    });
    this.add(this.exitLevelButton);
  }

  override onDeactivate(_context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    this.cleanLevel();
  }

  override onPreUpdate(_engine: Engine, _elapsedMs: number): void {
    // Called before anything updates in the scene
    switch (this.levelMode) {
      case "intro":
        // intro showing instructions.md with a "Start Level" button to move to "playing" mode
        break;
      case "paused":
        // pause the level showing "Paused" and a "Resume" button to move back to "playing" mode
        break;
      case "playing":
        // waiting for player to click on tokens to set into the tray
        this.runPlayingStep();
        break;
      case "running":
        // executing the bot's commands
        this.runCommandStep(this.bot);
        break;
      case "won":
        // show some cool winning animation?
        break;
      case "lost":
        // show some sad losing animation?
        break;
      default:
        break;
    }
  }

  override onPostUpdate(_engine: Engine, _elapsedMs: number): void {
    // Called after everything updates in the scene
  }

  override onPreDraw(_ctx: ExcaliburGraphicsContext, _elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(
    _ctx: ExcaliburGraphicsContext,
    _elapsedMs: number,
  ): void {
    // Called after Excalibur draws to the screen
  }
}
