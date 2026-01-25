import { GameConfig } from "../config/GameConfig.js";
import type { Bounds } from "./physics.js";
import type { PhysicsEntity } from "../ecs/Entity.js";

export class PhysicsSystem {
    private readonly gravity: number = GameConfig.physics.gravity;
    private readonly groundOffset: number = GameConfig.physics.groundOffset;

    update(entities: PhysicsEntity[], bounds: Bounds): void {
        for (const entity of entities) {
            entity.physics.velocityY += this.gravity;
            entity.position.y += entity.physics.velocityY;
            this.groundCollision(entity, bounds);
        }
    }

    private groundCollision(entity: PhysicsEntity, bounds: Bounds): void {
        const groundLevel = bounds.height - this.groundOffset;
        if (entity.position.y + entity.dimension.height >= groundLevel) {
            entity.position.y = groundLevel - entity.dimension.height;
            entity.physics.velocityY = 0;
            entity.physics.onGround = true;
        }
    }
}
