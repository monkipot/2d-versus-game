import { Player } from "../Player.js";

export class DebugOverlay {
    private readonly element: HTMLPreElement;

    constructor(canvas: HTMLCanvasElement) {
        this.element = document.createElement("pre");
        this.element.style.position = "absolute";
        this.element.style.left = `${canvas.offsetLeft + canvas.width + 10}px`;
        this.element.style.top = `${canvas.offsetTop}px`;
        this.element.style.color = "black";
        document.body.appendChild(this.element);
    }

    update(players: Player[]): void {
        this.element.textContent = players
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
                  isAttacking: ${player.isAttacking()}
                  isParrying: ${player.isParrying()}
            `)
            .join();
    }
}