import {
  Actor,
  clamp,
  Collider,
  CollisionContact,
  Engine,
  EventEmitter,
  PointerButton,
  Side,
} from "excalibur";

export type TokenEvents = {
  "tokenfalling-clicked": Token;
  "tokentray-clicked": Token;
};
import { TokenCommand, TokenType } from "./models/token.model";

// Actors are the main unit of composition you'll likely use, anything that you want to draw and move around the screen
// is likely built with an actor

// They contain a bunch of useful components that you might use
// actor.transform
// actor.motion
// actor.graphics
// actor.body
// actor.collider
// actor.actions
// actor.pointer

export class Token extends Actor {
  // main properties
  tokenType: TokenType = "";   // e.g. "fwd", "fwd2", "fwd3"
  mode: "falling" | "placed" | "unused" = "unused";

  readonly tokenEvents = new EventEmitter<TokenEvents>();

  // properties used while in falling mode
  fallingColumn: number = -1;  // column to fall down on 0, 1, 2 assigned randomly
  clickable: boolean = false;

  // properties used while in tray mode (will get 'shifted' off array when used each turn)
  tokenCommands: TokenCommand[] = [];    // e.g. ["fwd", "fwd"] for fwd2 token

  constructor() {
    super({
      // Giving your actor a name is optional, but helps in debugging using the dev tools or debug mode
      //name: "Gippity",
      //pos: vec(50, 50),
      width: 40,
      height: 40,
      // anchor: vec(0, 0), // Actors default center colliders and graphics with anchor (0.5, 0.5)
      // collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
    });
  }

  addNextCommand(cmd: TokenCommand) {
    this.tokenCommands.push(cmd);
  }

  pullNextCommand(): string | undefined {
    if (this.tokenCommands.length === 0) {
      return undefined;
    }
    return this.tokenCommands.shift();
  }



  //////////////////////////////////////////////////////////////////////////////
  // Excalibur lifecycle methods

  override onInitialize() {
    // Generally recommended to stick logic in the "On initialize"
    // This runs before the first update
    // Useful when
    // 1. You need things to be loaded like Images for graphics
    // 2. You need excalibur to be initialized & started
    // 3. Deferring logic to run time instead of constructor time
    // 4. Lazy instantiation

    // Sometimes you want to click on an actor!
    this.on("pointerdown", (evt) => {
      // Pointer events tunnel in z order from the screen down, you can cancel them!
      // if (true) {
      //   evt.cancel();
      // }
      // ***********************
      // Clicking on token while falling is different than clicking on it while in tray
      // so you might want to check mode
      if (this.mode === "falling" && evt.button === PointerButton.Left) {
        this.tokenEvents.emit("tokenfalling-clicked", this);
        evt.cancel();
      }
      if (this.mode === "placed" && evt.button === PointerButton.Left) {
        this.tokenEvents.emit("tokentray-clicked", this);
        evt.cancel();
      }
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins

    // Handle the fading of falling tokens as they approach the top and bottom of the falling area
    if (this.mode === "falling") {
      if (this.pos.y <= 70) {
        this.graphics.opacity = clamp((this.pos.y - 50) / 20, 0, 1);
      } else if (this.pos.y > 410) {
        this.graphics.opacity = clamp(1 - (this.pos.y - 410) / 20, 0, 1);
      }
    }
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame after Actor builtins
  }

  override onPreCollisionResolve(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact,
  ): void {
    // Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
  }

  override onPostCollisionResolve(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact,
  ): void {
    // Called every time a collision is resolved and overlap is solved
  }

  override onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact,
  ): void {
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(
    self: Collider,
    other: Collider,
    side: Side,
    lastContact: CollisionContact,
  ): void {
    // Called when a pair of objects separates
  }
}
