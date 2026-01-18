import { WebGLRender } from "./WebGLRender.js";
import { InputHandler } from "./InputHandler.js";
import { Player } from "./Player.js";

export class Game {
    private canvas: HTMLCanvasElement;
    private webGL: WebGLRender;
    private input: InputHandler;
    private player: Player;

    constructor(canvasId: string) {
        const canvas = document.querySelector<HTMLCanvasElement>(canvasId);
        if (!canvas) {
            throw new Error("Cannot retrieve canvas element");
        }

        const gl = canvas.getContext("webgl");
        if (!gl) {
            throw new Error("WebGL is not supported");
        }

        this.canvas = canvas;
        this.webGL = new WebGLRender(gl);
        this.input = new InputHandler();
        this.player = new Player(50, 50);

        this.keyboard();
    }

    private keyboard(): void {
        this.input.setOnKeyDown((key) => {
            switch (key) {
                case "ArrowLeft":
                    if (this.player.x - this.player.step >= 0) {
                        this.player.moveLeft();
                    }
                    break;
                case "ArrowRight":
                    if (this.player.x + this.player.width + this.player.step <= this.canvas.width) {
                        this.player.moveRight();
                    }
                    break;
                case "ArrowUp":
                    if (this.player.y - this.player.step >= 0) {
                        this.player.moveUp();
                    }
                    break;
                case "ArrowDown":
                    if (this.player.y + this.player.height + this.player.step <= this.canvas.height) {
                        this.player.moveDown();
                    }
                    break;
            }
            this.render();
        });
    }

    render(): void {
        this.webGL.clear();
        this.webGL.drawRectangle(this.player.getRectangle());
    }
}