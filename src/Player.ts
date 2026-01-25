import type { Rectangle } from "./WebGLRender.js";
import { GameConfig } from "./config/GameConfig.js";
import { StateMachine } from "./fighter/StateMachine.js";
import { FighterState } from "./fighter/state.js";

export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    step: number;
    velocityY: number;
    onGround: boolean;
    health: number = GameConfig.player.initialHealth;
    strength: number = GameConfig.player.strength;
    attackRange: number = GameConfig.player.attackRange;
    private stateMachine: StateMachine = new StateMachine();

    constructor(
        x: number,
        y: number,
        width: number = GameConfig.player.width,
        height: number = GameConfig.player.height
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.step = GameConfig.player.step;
        this.velocityY = 0;
        this.onGround = false;
    }

    isAttacking(): boolean {
        return this.stateMachine.isAttacking();
    }

    isParrying(): boolean {
        return this.stateMachine.isParrying();
    }

    update(deltaTime: number): void {
        this.stateMachine.update(deltaTime);
    }

    moveLeft(): void {
        this.x -= this.step;
    }

    moveRight(): void {
        this.x += this.step;
    }

    getRectangle(): Rectangle {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    isInRange(opponent: Player): boolean {
        const gap = Math.max(this.x, opponent.x) - Math.min(this.x + this.width, opponent.x + opponent.width);
        return gap <= this.attackRange;
    }

    attack(opponent: Player): void {
        if (!this.stateMachine.transitionTo(FighterState.Attacking)) return;

        if (this.isInRange(opponent)) {
            const damages = opponent.isParrying() ? this.strength * 0.2 : this.strength;
            opponent.health -= damages;
        }
    }

    parry(): void {
        this.stateMachine.transitionTo(FighterState.Parrying);
    }

    stopParry(): void {
        if (this.isParrying()) {
            this.stateMachine.transitionTo(FighterState.Idle);
        }
    }
}
