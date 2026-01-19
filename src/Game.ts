import { WebGLRender } from "./WebGLRender.js";
import { InputHandler } from "./InputHandler.js";
import { Player } from "./Player.js";

export class Game {
    private canvas: HTMLCanvasElement;
    private webGL: WebGLRender;
    private input: InputHandler;
    private player: Player;
    private player2: Player;
    private gravity: number = 0.5;
    private jumpForce: number = -12;
    private debug: HTMLPreElement;

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
        this.player2 = new Player(canvas.width - 150, 50);
        this.debug = this.debugInfo();

        this.keyboard();
        this.loop();
    }

    private debugInfo(): HTMLPreElement {
        const debug = document.createElement("pre");
        debug.style.position = "absolute";
        debug.style.left = `${this.canvas.offsetLeft + this.canvas.width + 10}px`;
        debug.style.top = `${this.canvas.offsetTop}px`;
        debug.style.color = "black";
        document.body.appendChild(debug);
        return debug;
    }

    private debugUpdate(): void {
        this.debug.textContent = [this.player, this.player2]
            .map((player, i) => `
                Player ${i + 1}:
                  x: ${player.x.toFixed(1)}
                  y: ${player.y.toFixed(1)}
                  width: ${player.width}
                  height: ${player.height}
                  velocityY: ${player.velocityY.toFixed(2)}
                  onGround: ${player.onGround}
                  health: ${player.health}
                  strength: ${player.strength}
            `)
            .join();
    }

    private loop(): void {
        this.setGravity();
        this.render();
        this.debugUpdate();
        requestAnimationFrame(() => this.loop());
    }

    private setGravity(): void {
        [this.player, this.player2].map(player => {
            player.velocityY += this.gravity;
            player.y += player.velocityY;

            if (player.y + player.height >= this.canvas.height) {
                player.y = this.canvas.height - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
        });
    }

    private willCollide(nextX: number): boolean {
        return nextX < this.player2.x + this.player2.width && nextX + this.player.width > this.player2.x;
    }

    private keyboard(): void {
        this.input.setOnKeyDown((key) => {
            switch (key) {
                case "ArrowLeft": {
                    const nextX = this.player.x - this.player.step;
                    if (nextX >= 0 && !this.willCollide(nextX)) {
                        this.player.moveLeft();
                    }
                    break;
                }
                case "ArrowRight": {
                    const nextX = this.player.x + this.player.step;
                    if (nextX + this.player.width <= this.canvas.width && !this.willCollide(nextX)) {
                        this.player.moveRight();
                    }
                    break;
                }
                case "ArrowUp":
                    if (this.player.onGround && this.player.y - this.player.step >= 0) {
                        this.player.velocityY = this.jumpForce;
                        this.player.onGround = false;
                    }
                    break;
                case "a":
                    this.player.attack(this.player2);
                    break;
            }
            this.render();
        });
    }

    render(): void {
        this.webGL.clear();
        this.webGL.drawPlayer(this.player.getRectangle());
        this.webGL.drawPlayer(this.player2.getRectangle());
    }
}