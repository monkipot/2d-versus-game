import { GameConfig } from "../config/GameConfig.js";
import type { Bounds, PhysicsEntity } from "./physics.js";

export class PhysicsEngine {
    private gravity: number = GameConfig.physics.gravity;

    update(entities: PhysicsEntity[], bounds: Bounds): void {
        for (const entity of entities) {
            entity.velocityY += this.gravity;
            entity.y += entity.velocityY;
            this.groundCollision(entity, bounds);
        }
    }

    private groundCollision(entity: PhysicsEntity, bounds: Bounds): void {
        if (entity.y + entity.height >= bounds.height) {
            entity.y = bounds.height - entity.height;
            entity.velocityY = 0;
            entity.onGround = true;
        }
    }
}
