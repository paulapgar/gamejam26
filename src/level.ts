import {
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Scene,
  SceneActivationContext,
  vec,
  TileMap,
  Sprite,
} from "excalibur";
import { BKG_TILE_DEFS, LEVEL_TILE_DEFS } from "./resources";

import { getTileChar, BACKGROUND_TILES, getBkgTileSprite, LEVEL1_TILES, getLevelTileSprite } from "./levels/level.model";

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

    // Create a 10x10 TileMap using the `floor` sprite (40x40 tiles)
    const tileSize = 40;

    const bkgTileMap = new TileMap({
      pos: vec(0, 0),
      tileWidth: tileSize,
      tileHeight: tileSize,
      rows: 15,
      columns: 20,
    });

    // ensure tilemap renders behind actors
    bkgTileMap.z = -100;

    for (let ty = 0; ty < 15; ty++) {
      for (let tx = 0; tx < 20; tx++) {
        const tileChar = getTileChar(BACKGROUND_TILES, tx, ty);
        let spr: Sprite = getBkgTileSprite(tileChar);

        const tileRef = bkgTileMap.getTile(tx, ty);
        // Don't bother filling in the blank/black tiles
        if (tileRef  && spr != BKG_TILE_DEFS.black) {
          tileRef.addGraphic(spr);
        }
      }
    }

    this.add(bkgTileMap);

    const levelTileMap = new TileMap({
      pos: vec(tileSize*1, tileSize*1),
      tileWidth: tileSize,
      tileHeight: tileSize,
      rows: 10,
      columns: 10,
    });

    levelTileMap.z = -50
    for (let ty = 0; ty < 10; ty++) {
      for (let tx = 0; tx < 10; tx++) {
        const tileChar = getTileChar(LEVEL1_TILES, tx, ty);
        let spr: Sprite = getLevelTileSprite(tileChar);

        const tileRef = levelTileMap.getTile(tx, ty);
        // Don't bother filling in the blank/black tiles
        if (tileRef  && spr != LEVEL_TILE_DEFS.black) {
          tileRef.addGraphic(spr);
        }
      }
    }
    this.add(levelTileMap);

  }

  override onPreLoad(_loader: DefaultLoader): void {
    // Add any scene specific RESOURCE to load
  }

  override onActivate(_context: SceneActivationContext<unknown>): void {
    // Called when Excalibur transitions to this scene
    // Only 1 scene is active at a time
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
