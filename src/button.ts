import {
  Actor,
  Collider,
  CollisionContact,
  Engine,
  Font,
  Label,
  PointerButton,
  Side,
  Sprite,
  vec,
  Vector,
} from "excalibur";
import { gameFontDarkGray, gameFontGray, gameFontWhite } from "./resources";

export class MyButton extends Actor {
  label: Label;
  text: string;
  position: Vector;
  hoverFont: Font = gameFontWhite;
  noHoverFont: Font = gameFontGray;
  disableFont: Font = gameFontDarkGray;
  enabled: boolean = true;

  constructor(position: Vector, graphic: Sprite, text: string = "") {
    super({
      width: graphic.width,
      height: graphic.height,
    });
    
    this.text = text;

    this.label = new Label({
        text: this.text,
        pos: vec(0, 0 - this.noHoverFont.size / 2), // center text vertically
        font: this.noHoverFont,
    });
    
    this.graphics.use(graphic);
    // Assumes all fonts are the same size
    this.addChild(this.label);
    
    this.position = position;
    this.setHidden();   // start off screen until we set visibility
    this.z = 20;

    this.pointer.useGraphicsBounds = true;

    this.on("pointerenter", () => {
        if (this.enabled) {
            this.highlightLabel();
    }
    });

    this.on("pointerleave", () => {
        if (this.enabled) {
            this.enableLabel();
        }
    });
  }

  highlightLabel() {
    this.label.font = this.hoverFont;
  }

  enableLabel() {
      this.label.font = this.noHoverFont;
  }

  disableLabel() {
      this.label.font = this.disableFont;
  }

  setVisible() {
    this.pos = this.position;
    this.enableLabel()
  }

  setHidden() {
    this.pos = vec(-1000, -1000);
  }

  setEnabled() {
    this.enableLabel();
    this.enabled = true;
  }

  setDisabled() {
    this.disableLabel();
    this.enabled = false;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Excalibur lifecycle methods

  override onInitialize(): void {
    this.on("pointerdown", (evt) => {
      if (evt.button === PointerButton.Left) {
        evt.cancel();
      }
    });
  }

  override onPreUpdate(_engine: Engine, _elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins
  }

  override onPostUpdate(_engine: Engine, _elapsedMs: number): void {
    // Put any update logic here runs every frame after Actor builtins
  }

  override onPreCollisionResolve(
    _self: Collider,
    _other: Collider,
    _side: Side,
    _contact: CollisionContact,
  ): void {
    // Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
  }

  override onPostCollisionResolve(
    _self: Collider,
    _other: Collider,
    _side: Side,
    _contact: CollisionContact,
  ): void {
    // Called every time a collision is resolved and overlap is solved
  }

  override onCollisionStart(
    _self: Collider,
    _other: Collider,
    _side: Side,
    _contact: CollisionContact,
  ): void {
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(
    _self: Collider,
    _other: Collider,
    _side: Side,
    _lastContact: CollisionContact,
  ): void {
    // Called when a pair of objects separates
  }
}
