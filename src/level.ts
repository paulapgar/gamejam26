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
} from "excalibur";

import { ANIM, LEVEL_TILE_SPRITE, bkgSprite } from "./resources";

import {
  getTileChar,
  getLevelTileSprite,
  LevelData,
} from "./models/level.model";

import { Bot } from "./bot";
import { Token } from "./token";
import { TOKEN_DATA } from "./models/token.data";
import { TokenType } from "./models/token.model";

const BKG_Z = -100;
const TILE_Z = -50;

const tileSize = 40;
const tileMapOffset = vec(60, 60); // the middle of tile (0,0)

export class MyLevel extends Scene {
  levelTileMap!: TileMap;
  myLevelData!: LevelData;
  bot: Bot = new Bot();
  levelMode: "intro" | "paused" | "playing" | "running" | "won" | "lost" =
    "intro";
  tokenTray: Token[] = [];
  tokenTrayActive: number = -1; // index of active token in the tray or -1 if no active token
  tokenTrayActiveOverlay!: Actor; // overlay Actor to show the token graphic of the active token in the tray

  getAvailableTokenTrayIndex(): number {
    for (let i = 0; i < this.tokenTray.length; i++) {
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

  // Return true if the bot should not continue with the next command (e.g. because it reached the exit or a blocked tile and should win or die)
  evaluateActionForCurrentTile(bot: Bot) :boolean{
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
        this.levelMode = "won";
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
      switch (cmd) {
        case "fwd":
          const nextTile = this.getNextTileInDirection(
            bot.currentTile,
            bot.facing,
          );
          let tileType = this.getTileType(nextTile);
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

    // const testLabel = new Label({
    //   text: "FWD",
    //   pos: vec(100, 12*40),
    //   font: gameFont,
    // });

    // this.add(testLabel);
  }

  override onPreLoad(_loader: DefaultLoader): void {
    // Add any scene specific RESOURCE to load
  }

  override onActivate(context: SceneActivationContext<LevelData>): void {
    // Called when Excalibur transitions to this scene
    // Only 1 scene is active at a time

    // Some initializing logic
    this.tokenTrayActive = -1;
    this.levelMode = "running"; // **** for testing purposes, should be "intro"
    this.tokenTrayActiveOverlay.pos = vec(-100, -100); // move off screen until we have an active token running

    this.myLevelData = context.data!;

    this.bot.moving = false;
    this.bot.dying = false;
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
              const zapSpeed = randomIntInRange(1,3);
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

    // Now we build up the tray based on the numTokens for the level
    // Fugly code ...
    // First row if there are more than 10 Compute
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
    // Second row if there are more than 10 Compute otherwise first row
    for (
      let i = row * 10;
      i < row * 10 + (this.myLevelData.numTokens % 10);
      i++
    ) {
      this.tokenTray[i].graphics.use(LEVEL_TILE_SPRITE.tokentray);
      this.tokenTray[i].pos = vec((i - row * 10) * 40 + 60, j * 40 + 20);
      this.tokenTray[i].z = TILE_Z;
    }

    // Add some tokens to the tray for testing

    let token = this.getAvailableTokenTrayIndex();
    if (token != -1) {
      let tokenType: TokenType = "fwd4";
      this.tokenTray[token].tokenType = tokenType;
      this.tokenTray[token].mode = "placed";
      this.tokenTray[token].tokenCommands = [...TOKEN_DATA[tokenType].commands];
      const tokenOverlay = new Actor({ pos: vec(0, 0) });
      tokenOverlay.graphics.use(TOKEN_DATA[tokenType].graphic);
      this.tokenTray[token].addChild(tokenOverlay);
    }

    // token = this.getAvailableTokenTrayIndex();
    // if (token != -1) {
    //   let tokenType: TokenType = "tr";
    //   this.tokenTray[token].tokenType = tokenType;
    //   this.tokenTray[token].mode = "placed";
    //   this.tokenTray[token].tokenCommands = [...TOKEN_DATA[tokenType].commands];
    //   const tokenOverlay = new Actor({ pos: vec(0, 0) });
    //   tokenOverlay.graphics.use(TOKEN_DATA[tokenType].graphic);
    //   this.tokenTray[token].addChild(tokenOverlay);
    // }

    // token = this.getAvailableTokenTrayIndex();
    // if (token != -1) {
    //   let tokenType: TokenType = "tr";
    //   this.tokenTray[token].tokenType = tokenType;
    //   this.tokenTray[token].mode = "placed";
    //   this.tokenTray[token].tokenCommands = [...TOKEN_DATA[tokenType].commands];
    //   const tokenOverlay = new Actor({ pos: vec(0, 0) });
    //   tokenOverlay.graphics.use(TOKEN_DATA[tokenType].graphic);
    //   this.tokenTray[token].addChild(tokenOverlay);
    // }

    token = this.getAvailableTokenTrayIndex();
    if (token != -1) {
      let tokenType: TokenType = "fwd3";
      this.tokenTray[token].tokenType = tokenType;
      this.tokenTray[token].mode = "placed";
      this.tokenTray[token].tokenCommands = [...TOKEN_DATA[tokenType].commands];
      const tokenOverlay = new Actor({ pos: vec(0, 0) });
      tokenOverlay.graphics.use(TOKEN_DATA[tokenType].graphic);
      this.tokenTray[token].addChild(tokenOverlay);
    }

    // ******* Debugging purposes simulate an "Execute Plan" button click!
    this.levelMode = "running";
  }

  override onDeactivate(_context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time

    // clean out the token tray
    for (const token of this.tokenTray) {
      for (const child of token.children) {
        token.removeChild(child);
      }
      token.mode = "unused";
      token.tokenCommands = [];
      token.tokenType = "";
    }
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
