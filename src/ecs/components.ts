import { StateMachine } from "../fighter/StateMachine.js";

export interface PositionComponent {
    x: number;
    y: number;
}

export interface DimensionComponent {
    width: number;
    height: number;
}

export interface PhysicsComponent {
    velocityY: number;
    onGround: boolean;
}

export interface MovementComponent {
    step: number;
}

export interface CombatComponent {
    health: number;
    strength: number;
    attackRange: number;
}

export interface StateComponent {
    //TODO: transform to system
    stateMachine: StateMachine;
}
