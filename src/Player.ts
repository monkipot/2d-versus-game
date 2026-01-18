import type { Rectangle } from "./WebGLRender.js";

export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    step: number;

    constructor(x: number, y: number, width: number = 100, height: number = 150) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.step = 10;
    }

    moveLeft(): void {
        this.x -= this.step;
    }

    moveRight(): void {
        this.x += this.step;
    }

    moveUp(): void {
        this.y -= this.step;
    }

    moveDown(): void {
        this.y += this.step;
    }

    getRectangle(): Rectangle {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}