import { DefaultLoader, Engine, ExcaliburGraphicsContext, Scene, SceneActivationContext, vec } from "excalibur";

import { runRightAnim } from "./resources";
import { Bot } from "./bot";

export class MyLevel extends Scene {
    override onInitialize(engine: Engine): void {
        // Scene.onInitialize is where we recommend you perform the composition for your game
        //const player = new Player();
        //this.add(player); // Actors need to be added to a scene to be drawn

        const bot = new Bot();
        bot.graphics.use(runRightAnim);
        bot.pos = vec(20,20);
        this.add(bot);

    }

    override onPreLoad(loader: DefaultLoader): void {
        // Add any scene specific RESOURCE to load
    }

    override onActivate(context: SceneActivationContext<unknown>): void {
        // Called when Excalibur transitions to this scene
        // Only 1 scene is active at a time
    }

    override onDeactivate(context: SceneActivationContext): void {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
    }

    override onPreUpdate(engine: Engine, elapsedMs: number): void {
        // Called before anything updates in the scene
    }

    override onPostUpdate(engine: Engine, elapsedMs: number): void {
        // Called after everything updates in the scene
    }

    override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called before Excalibur draws to the screen
    }

    override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called after Excalibur draws to the screen
    }
}