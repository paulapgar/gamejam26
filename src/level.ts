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
  Entity,
} from "excalibur";

import { LEVEL_TILE_SPRITE, TOKEN_SPRITE, bkgSprite } from "./resources";

import {
  getTileChar,
  getLevelTileSprite,
  LevelData,
} from "./models/level.model";

import { Bot } from "./bot";

const BKG_Z = -100;
const TILE_Z = -50;

const tileSize = 40;
const tileMapOffset = vec(60, 60); // the middle of tile (0,0)

export class MyLevel extends Scene {
  levelTileMap!: TileMap;
  myLevelData!: LevelData;
  bot: Bot = new Bot();
  levelMode: "intro" | "paused" | "playing" | "running" | "won" | "lost" = "intro";
  tokenTray: Actor[] = [];
  tokenTrayPlan: string[] = []; // array of token types in the order they were placed in the tray
  tokenTrayActive: number = -1; // index of active token in the tray or -1 if no active token

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

    // Initialize the token tray with Actors for the spaces based on number of tokens allowed in level
    for (let x = 0; x < 20; x++) {
      this.tokenTray[x] = new Actor();
      this.tokenTray[x].graphics.use(LEVEL_TILE_SPRITE.black);
      this.tokenTray[x].pos = vec(-100, -100); // start off screen until we set them properly in onActivate
      this.tokenTray[x].z = TILE_Z;
      this.add(this.tokenTray[x]);
    }

    const token = new Actor({ pos: vec(12 * 40 + 20, 20) });
    token.graphics.use(TOKEN_SPRITE.fwd2);
    this.add(token);

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

    // Clear the token tray area and add tokens based on the level data
    for (let tx = 1; tx < 11; tx++) {
      for (let ty = 11; ty < 13; ty++) {
        const tileRef = this.levelTileMap.getTile(tx, ty);
        if (tileRef) {
          tileRef.clearGraphics();
        }
      }
    }

    for (let i = 0; i < this.myLevelData.numTokens; i++) {
      this.tokenTray[i].graphics.use(LEVEL_TILE_SPRITE.black);
      this.tokenTray[i].pos = vec(-100, -100); // start off screen until we set them properly below
      this.tokenTray[i].z = TILE_Z;
    }

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
    for (let i = row*10; i < (row*10)+(this.myLevelData.numTokens % 10); i++) {
        this.tokenTray[i].graphics.use(LEVEL_TILE_SPRITE.tokentray);
        this.tokenTray[i].pos = vec((i-(row*10)) * 40 + 60, j * 40 + 20);
        this.tokenTray[i].z = TILE_Z;
    }

    // ******* Debugging purposes
    this.levelMode = "playing";


  }

  override onDeactivate(_context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
  }

  override onPreUpdate(_engine: Engine, _elapsedMs: number): void {
    // Called before anything updates in the scene
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
