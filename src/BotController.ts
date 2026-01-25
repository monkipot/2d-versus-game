import { Player } from "./Player.js";
import { GameConfig } from "./config/GameConfig.js";

export class BotController {
    private bot: Player;
    private readonly target: Player;
    private canAttack: boolean = true;

    constructor(bot: Player, target: Player) {
        this.bot = bot;
        this.target = target;
    }

    update(): void {
        const distanceToTarget = this.bot.position.x - (this.target.position.x + this.target.dimension.width);
        const inAttackRange = this.bot.isInRange(this.target);

        if (inAttackRange && this.canAttack) {
            this.bot.attack(this.target);
            this.canAttack = false;
            setTimeout(() => this.canAttack = true, GameConfig.bot.attackCooldown);
            return;
        }

        if (distanceToTarget > this.bot.combat.attackRange) {
            if(!this.bot.physics.onGround) return;
            const nextX = this.bot.position.x - this.bot.movement.step;
            if (nextX > this.target.position.x + this.target.dimension.width) {
                this.bot.moveLeft();
            }
        }
    }
}