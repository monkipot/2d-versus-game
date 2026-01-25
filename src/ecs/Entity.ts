import type {
    PositionComponent,
    DimensionComponent,
    PhysicsComponent,
    MovementComponent,
    CombatComponent,
    StateComponent,
} from "./components.js";

export interface Entity {
    position: PositionComponent;
    dimension: DimensionComponent;
    physics?: PhysicsComponent;
    movement?: MovementComponent;
    combat?: CombatComponent;
    state?: StateComponent;
}

export interface PhysicsEntity extends Entity {
    physics: PhysicsComponent;
}

export interface CombatEntity extends Entity {
    combat: CombatComponent;
    state: StateComponent;
}

export interface MovableEntity extends Entity {
    movement: MovementComponent;
}

export function hasPhysics(entity: Entity): entity is PhysicsEntity {
    return entity.physics !== undefined;
}

export function hasCombat(entity: Entity): entity is CombatEntity {
    return entity.combat !== undefined && entity.state !== undefined;
}

export function hasMovement(entity: Entity): entity is MovableEntity {
    return entity.movement !== undefined;
}
