import type { Rectangle } from "./WebGLRender.js";
import { GameConfig } from "./config/GameConfig.js";
import { StateMachine } from "./fighter/StateMachine.js";
import { FighterState } from "./fighter/state.js";
import { CombatSystem } from "./fighter/CombatSystem.js";
import type { Fighter } from "./fighter/fighter.js";
import type {
    PositionComponent,
    DimensionComponent,
    PhysicsComponent,
    MovementComponent,
    CombatComponent,
    StateComponent,
} from "./ecs/components.js";

export class Player implements Fighter {
    position: PositionComponent;
    dimension: DimensionComponent;
    physics: PhysicsComponent;
    movement: MovementComponent;
    combat: CombatComponent;
    state: StateComponent;

    private static combatSystem: CombatSystem = new CombatSystem();

    constructor(
        x: number,
        y: number,
        width: number = GameConfig.player.width,
        height: number = GameConfig.player.height
    ) {
        this.position = { x, y };
        this.dimension = { width, height };
        this.physics = { velocityY: 0, onGround: false };
        this.movement = { step: GameConfig.player.step };
        this.combat = {
            health: GameConfig.player.initialHealth,
            strength: GameConfig.player.strength,
            attackRange: GameConfig.player.attackRange,
        };
        this.state = { stateMachine: new StateMachine() };
    }

    isAttacking(): boolean {
        return this.state.stateMachine.isAttacking();
    }

    isParrying(): boolean {
        return this.state.stateMachine.isParrying();
    }

    isJumping(): boolean {
        return this.state.stateMachine.isJumping();
    }

    update(deltaTime: number): void {
        this.state.stateMachine.update(deltaTime);
    }

    moveLeft(): void {
        this.position.x -= this.movement.step;
    }

    moveRight(): void {
        this.position.x += this.movement.step;
    }

    getRectangle(): Rectangle {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.dimension.width,
            height: this.dimension.height
        };
    }

    isInRange(opponent: Player): boolean {
        return Player.combatSystem.isInRange(this, opponent);
    }

    attack(opponent: Player): void {
        if (!this.state.stateMachine.transitionTo(FighterState.Attacking)) return;
        Player.combatSystem.attack(this, opponent);
    }

    parry(): void {
        this.state.stateMachine.transitionTo(FighterState.Parrying);
    }

    stopParry(): void {
        if (this.isParrying()) {
            this.state.stateMachine.transitionTo(FighterState.Idle);
        }
    }
}