import { WebGLRender } from "./WebGLRender.js";
import { InputHandler } from "./InputHandler.js";
import { Player } from "./Player.js";

export class Game {
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

        this.webGL = new WebGLRender(gl);
        this.input = new InputHandler();
        this.player = new Player(50, 50);

        this.keyboard();
    }

    private keyboard(): void {
        this.input.setOnKeyDown((key) => {
            switch (key) {
                case "ArrowLeft":
                    this.player.moveLeft();
                    break;
                case "ArrowRight":
                    this.player.moveRight();
                    break;
                case "ArrowUp":
                    this.player.moveUp();
                    break;
                case "ArrowDown":
                    this.player.moveDown();
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