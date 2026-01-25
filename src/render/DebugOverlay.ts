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
                  x: ${player.position.x.toFixed(1)}
                  y: ${player.position.y.toFixed(1)}
                  width: ${player.dimension.width}
                  height: ${player.dimension.height}
                  velocityY: ${player.physics.velocityY.toFixed(2)}
                  onGround: ${player.physics.onGround}
                  health: ${player.combat.health}
                  strength: ${player.combat.strength}
                  isAttacking: ${player.isAttacking()}
                  isParrying: ${player.isParrying()}
            `)
            .join();
    }
}