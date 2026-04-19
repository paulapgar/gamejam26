import {
  Actor,
  Collider,
  CollisionContact,
  Engine,
  Side,
  vec,
  Vector,
} from "excalibur";
import { animRunLeft, animRunRight, animStandLeft, animStandRight } from "./resources";

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

export type Facing = "Up" | "Down" | "Left" | "Right";

export class Bot extends Actor {
  facing: Facing = "Right";
  currentTile: Vector = vec(-1,-1); // x, y of Tiles not pixels  -1,-1 means not set
  targetTile: Vector = vec(-1,-1);  // x, y of Tiles not pixels  -1,-1 means not set
  //carriedItem: Item = undefined;
  moving: boolean = false;

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

  isMoving() : boolean {
    return this.moving;
  }

  setAnimation() {
    switch (this.facing) {
        case "Left":
            if (this.isMoving()) {
                this.graphics.use(animRunLeft);
            }
            else {
                this.graphics.use(animStandLeft);
            }
        break;
        case "Right":
            if (this.isMoving()) {
                this.graphics.use(animRunRight);
            }
            else {
                this.graphics.use(animStandRight);
            }
        break;
    }
  }

  turnLeft() {
    switch (this.facing) {
      case "Up":
        this.facing = "Left";
        break;
      case "Down":
        this.facing = "Right";
        break;
      case "Right":
        this.facing = "Up";
        break;
      case "Left":
        this.facing = "Down";
        break;
      default:
        console.log("Error: turnLeft, this.facing not set");
        break;
    }
  }

  turnRight() {
    switch (this.facing) {
      case "Up":
        this.facing = "Right";
        break;
      case "Down":
        this.facing = "Left";
        break;
      case "Right":
        this.facing = "Down";
        break;
      case "Left":
        this.facing = "Up";
        break;
      default:
        console.log("Error: turnRight, this.facing not set");
        break;
    }
  }

  setMoveForward() {
    this.moving = true;

    switch (this.facing) {
        case "Right":
            break;
        case "Left":
            break;
        case "Up":
            break;
        case "Down":
            break;
        default:
            console.log("Error: moveForward, this.facing not set");
            break;
    }
  }

  setMoveStop() {
    this.moving = false;
}


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
      console.log("You clicked the actor @", evt.worldPos.toString());
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins
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
