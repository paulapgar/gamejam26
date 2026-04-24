import {
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Scene,
  SceneActivationContext,
  vec,
  TileMap,
  Sprite,
  Actor,
  Vector,
} from "excalibur";

import { LEVEL_TILE_SPRITE, TOKEN_SPRITE, bkgSprite } from "./resources";

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
  levelMode: "intro" | "paused" | "playing" | "running" | "won" | "lost" = "intro";
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

  runCommandStep(bot: Bot) {
    if (bot.isMoving()) return; // wait until bot is done with current move

    // Check the bot's current tile and decide what to do based on that and the next command in the bot's queue

    // This is where the main logic for executing the bot's commands is going to go
    
    if (this.tokenTrayActive < 0) {
      this.tokenTrayActive = 0;
      this.tokenTrayActiveOverlay.pos = this.tokenTray[this.tokenTrayActive].pos;
    }
    let cmd = this.tokenTray[this.tokenTrayActive].pullNextCommand()
    if (!cmd) {
      this.tokenTrayActive++;
      if (this.tokenTrayActive >= this.tokenTray.length) {
        this.tokenTrayActive = -1; // no more commands to execute
        // *** Probably die when running out of commands if above check for current tile exit fails
        // *** DIE
        // *** Set it to levelMode = "lost" for now
        this.levelMode = "lost";
      } else {
        // update the position of the active token in the tray
        this.tokenTrayActiveOverlay.pos = this.tokenTray[this.tokenTrayActive].pos;
      }
    }
    else {
      switch (cmd) {
        case "fwd":
          const nextTile = this.getNextTileInDirection(bot.currentTile, bot.facing);
          // Need to do some checking nextTile(TYPE) here and call setMoveBlocked()
          // *** testing ***
          this.bot.targetTile = nextTile;
          this.bot.setMoveForward();
          break;
        case "tr":
          this.bot.turnRight();
          break;
        case "tl":
          this.bot.turnLeft();
          break;
        }
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

    this.myLevelData = context.data!;

    this.bot.setFacing(this.myLevelData.botFacing);
    this.bot.moving = false;
    this.bot.setAnimation();

    // This is going to load the level based on what level is passed in the context
    for (let ty = 0; ty < 10; ty++) {
      for (let tx = 0; tx < 10; tx++) {
        const tileChar = getTileChar(this.myLevelData.charMap, tx, ty);
        let spr: Sprite = getLevelTileSprite(tileChar);

        const tileRef = this.levelTileMap.getTile(tx, ty);
        // Don't bother filling in the blank/black tiles
        if (tileRef && spr != LEVEL_TILE_SPRITE.black) {
          tileRef.addGraphic(spr);
        }
        if (tileChar === "e") {
          this.bot.currentTile = vec(tx, ty);
          //          vec(tx * tileSize + tileMapOffset.x, ty * tileSize + tileMapOffset.y);
          this.bot.pos = vec(
            tx * tileSize + tileMapOffset.x,
            ty * tileSize + tileMapOffset.y,
          );
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
    let j = 12;
    let row = 0;
    if (this.myLevelData.numTokens > 10) {
      for (let i = 0; i < 10; i++) {
        this.tokenTray[i].graphics.use(LEVEL_TILE_SPRITE.tokentray);
        this.tokenTray[i].pos = vec(i * 40 + 60, j * 40 + 20);
        this.tokenTray[i].z = TILE_Z;
      }
      j++;
      row = 1;
    }
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
      let tokenType:TokenType = "fwd4";
      this.tokenTray[token].tokenType = tokenType;
      this.tokenTray[token].mode = "placed";
      this.tokenTray[token].tokenCommands = [...TOKEN_DATA[tokenType].commands];
      const tokenOverlay = new Actor({ pos: vec(0, 0) });
      tokenOverlay.graphics.use(TOKEN_DATA[tokenType].graphic);
      this.tokenTray[token].addChild(tokenOverlay);
    }

    token = this.getAvailableTokenTrayIndex();
    if (token != -1) {
      let tokenType:TokenType = "tr";
      this.tokenTray[token].tokenType = tokenType;
      this.tokenTray[token].mode = "placed";
      this.tokenTray[token].tokenCommands = [...TOKEN_DATA[tokenType].commands];
      const tokenOverlay = new Actor({ pos: vec(0, 0) });
      tokenOverlay.graphics.use(TOKEN_DATA[tokenType].graphic);
      this.tokenTray[token].addChild(tokenOverlay);
    }

    token = this.getAvailableTokenTrayIndex();
    if (token != -1) {
      let tokenType:TokenType = "tr";
      this.tokenTray[token].tokenType = tokenType;
      this.tokenTray[token].mode = "placed";
      this.tokenTray[token].tokenCommands = [...TOKEN_DATA[tokenType].commands];
      const tokenOverlay = new Actor({ pos: vec(0, 0) });
      tokenOverlay.graphics.use(TOKEN_DATA[tokenType].graphic);
      this.tokenTray[token].addChild(tokenOverlay);
    }

    token = this.getAvailableTokenTrayIndex();
    if (token != -1) {
      let tokenType:TokenType = "fwd2";
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
        // maybe some intro animation or something?
        break;
      case "paused":
        // waiting for player to press "execute" button
        break;
      case "playing":
        // waiting for player to place tokens in the tray
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
