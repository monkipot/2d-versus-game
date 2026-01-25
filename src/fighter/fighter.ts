import type {
    PositionComponent,
    DimensionComponent,
    CombatComponent,
    StateComponent,
} from "../ecs/components.js";

export interface Fighter {
    position: PositionComponent;
    dimension: DimensionComponent;
    combat: CombatComponent;
    state: StateComponent;
    isAttacking(): boolean;
    isParrying(): boolean;
    isJumping(): boolean;
}