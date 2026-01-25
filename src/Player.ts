import type { Rectangle } from "./WebGLRender.js";
import { GameConfig } from "./config/GameConfig.js";
import { StateMachine } from "./fighter/StateMachine.js";
import { FighterState } from "./fighter/state.js";
import { FightEngine } from "./fighter/FightEngine.js";

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
    private static fightEngine: FightEngine = new FightEngine();

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

    isJumping(): boolean {
        return this.stateMachine.isJumping();
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
        return Player.fightEngine.isInRange(this, opponent);
    }

    attack(opponent: Player): void {
        if (!this.stateMachine.transitionTo(FighterState.Attacking)) return;
        Player.fightEngine.attack(this, opponent);
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
