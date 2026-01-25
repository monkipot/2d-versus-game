import type { Rectangle } from "./WebGLRender.js";
import { GameConfig } from "./config/GameConfig.js";

export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    step: number;
    //TODO: should be a statePlayer
    velocityY: number;
    onGround: boolean;
    health: number = GameConfig.player.initialHealth;
    strength: number = GameConfig.player.strength;
    attackRange: number = GameConfig.player.attackRange;
    isAttacking: boolean = false;
    isParrying: boolean = false;

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
        this.isAttacking = true;
        if (this.isInRange(opponent)) {
            const damages = opponent.isParrying ? this.strength * 0.2 : this.strength
            opponent.health -= damages;
        }
        setTimeout(() => {
            this.isAttacking = false;
        }, GameConfig.player.attackDuration);
    }

    parry(): void {
        this.isParrying = true;
    }

    stopParry(): void {
        this.isParrying = false;
    }
}