import type { Rectangle } from "./WebGLRender.js";

export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    step: number;
    //TODO: should be a statePlayer
    velocityY: number;
    onGround: boolean;
    health: number = 100;
    strength: number = 10;
    attackRange: number = 20;
    isAttacking: boolean = false;
    isParrying: boolean = false;

    constructor(x: number, y: number, width: number = 60, height: number = 150) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.step = 10;
        this.velocityY = 0;
        this.onGround = true;
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
        return Math.abs((this.x + this.width) - opponent.x) <= this.attackRange;
    }

    attack(opponent: Player): void {
        this.isAttacking = true;
        if (this.isInRange(opponent)) {
            opponent.health -= this.strength;
        }
        setTimeout(() => {
            this.isAttacking = false;
        }, 300);
    }

    parry(): void {
        this.isParrying = true;
    }

    stopParry(): void {
        this.isParrying = false;
    }
}