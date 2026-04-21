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
  Label,
} from "excalibur";
import { LEVEL_TILE_DEFS, bkgSprite, gameFont } from "./resources";

import {
  getTileChar,
  LEVEL1_TILES,
  getLevelTileSprite,
} from "./levels/level.model";

import { Bot } from "./bot";

export class MyLevel extends Scene {
  levelTileMap!: TileMap;

  override onInitialize(_engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game
    //const player = new Player();
    //this.add(player); // Actors need to be added to a scene to be drawn

    const bot = new Bot();
    bot.setAnimation();
    bot.pos = vec(100, 100);
    this.add(bot);

    // add background sprite as an Actor at pos(0,0) with anchor(0,0)
    const background = new Actor({
      pos: vec(0, 0),
      anchor: vec(0, 0),
      width: 800,
      height: 600,
      z: -100,
    });
    background.graphics.use(bkgSprite);
    this.add(background);

    // Create a 10x10 TileMap using the `floor` sprite (40x40 tiles)
    const tileSize = 40;

    this.levelTileMap = new TileMap({
      pos: vec(tileSize * 1, tileSize * 1),
      tileWidth: tileSize,
      tileHeight: tileSize,
      rows: 10,
      columns: 10,
    });

    this.add(this.levelTileMap);

    this.levelTileMap.z = -50;

    const testLabel = new Label({
      text: "Testing what the font\nLOOKS LIKE",
      pos: vec(100, 100),
      font: gameFont,
    });

    this.add(testLabel);
  }

  override onPreLoad(_loader: DefaultLoader): void {
    // Add any scene specific RESOURCE to load
  }

  override onActivate(_context: SceneActivationContext<unknown>): void {
    // Called when Excalibur transitions to this scene
    // Only 1 scene is active at a time
    for (let ty = 0; ty < 10; ty++) {
      for (let tx = 0; tx < 10; tx++) {
        const tileChar = getTileChar(LEVEL1_TILES, tx, ty);
        let spr: Sprite = getLevelTileSprite(tileChar);

        const tileRef = this.levelTileMap.getTile(tx, ty);
        // Don't bother filling in the blank/black tiles
        if (tileRef && spr != LEVEL_TILE_DEFS.black) {
          tileRef.addGraphic(spr);
        }
      }
    }
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
