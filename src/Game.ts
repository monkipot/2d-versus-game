import { WebGLRender } from "./WebGLRender.js";
import { InputHandler } from "./InputHandler.js";
import { Player } from "./Player.js";
import { AudioManager } from "./AudioManager.js";
import { BotController } from "./BotController.js";
import { GameConfig } from "./config/GameConfig.js";
import { DebugOverlay } from "./render/DebugOverlay.js";
import { PhysicsSystem } from "./physics/PhysicsSystem.js";

export class Game {
    private canvas: HTMLCanvasElement;
    private webGL: WebGLRender;
    private input: InputHandler;
    private audio: AudioManager;
    private player: Player;
    private player2: Player;
    private jumpForce: number = GameConfig.physics.jumpForce;
    private debugOverlay: DebugOverlay;
    private botController: BotController;
    private physicsSystem: PhysicsSystem = new PhysicsSystem();
    private lastTime: number = 0;

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
        this.webGL.loadBackground();
        this.input = new InputHandler();
        this.audio = new AudioManager();
        this.player = new Player(50, 50);
        this.player2 = new Player(canvas.width - 150, 50);
        this.botController = new BotController(this.player2, this.player);
        this.debugOverlay = new DebugOverlay(canvas);

        this.keyboard();
        requestAnimationFrame((t) => this.loop(t));
    }

    private loop(t: number): void {
        const dt = t - this.lastTime;
        this.lastTime = t;

        this.player.update(dt);
        this.player2.update(dt);
        this.physicsSystem.update([this.player, this.player2], this.canvas);
        this.botController.update();
        this.render();
        this.debugOverlay.update([this.player, this.player2]);
        requestAnimationFrame((t) => this.loop(t));
    }

    private willCollide(nextX: number): boolean {
        return nextX < this.player2.position.x + this.player2.dimension.width
            && nextX + this.player.dimension.width > this.player2.position.x;
    }

    private keyboard(): void {
        this.input.setOnKeyDown((key) => {
            switch (key) {
                case "ArrowLeft": {
                    const nextX = this.player.position.x - this.player.movement.step;
                    if (nextX >= 0 && !this.willCollide(nextX)) {
                        this.player.moveLeft();
                    }
                    break;
                }
                case "ArrowRight": {
                    const nextX = this.player.position.x + this.player.movement.step;
                    if (nextX + this.player.dimension.width <= this.canvas.width && !this.willCollide(nextX)) {
                        this.player.moveRight();
                    }
                    break;
                }
                case "ArrowUp":
                    if (this.player.physics.onGround && this.player.position.y - this.player.movement.step >= 0) {
                        this.player.physics.velocityY = this.jumpForce;
                        this.player.physics.onGround = false;
                        this.audio.jump();
                    }
                    break;
                case "a":
                    if (this.player.isAttacking()) return;
                    this.player.attack(this.player2);
                    this.audio.attack();
                    break;
                case "x":
                    if (!this.player.isParrying()) {
                        this.audio.parry();
                    }
                    this.player.parry();
                    break;
            }
            this.render();
        });

        this.input.setOnKeyUp((key) => {
            switch (key) {
                case "x":
                    this.player.stopParry();
                    break;
            }
        });
    }

    render(): void {
        this.webGL.clear();
        this.webGL.drawBackground();
        this.webGL.drawPlayer(this.player.getRectangle(), this.player.isAttacking(), this.player.isParrying());
        this.webGL.drawPlayer(this.player2.getRectangle(), this.player2.isAttacking(), this.player2.isParrying());
    }
}