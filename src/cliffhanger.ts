import {
  Engine,
  Scene,
  SceneActivationContext,
  DefaultLoader,
} from "excalibur";

export class Cliffhanger extends Scene {
  override onInitialize(_engine: Engine): void {
    // Called once when the scene is first initialized
  }

  override onPreLoad(_loader: DefaultLoader): void {
    // Add any scene-specific resources to the loader here
  }

  override onActivate(_context: SceneActivationContext<undefined>): void {
    // Called each time the scene becomes active
  }

  override onDeactivate(_context: SceneActivationContext<undefined>): void {
    // Called each time the scene becomes inactive
  }

  override onPreUpdate(_engine: Engine, _elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  override onPostUpdate(_engine: Engine, _elapsedMs: number): void {
    // Called after everything updates in the scene
  }
}
