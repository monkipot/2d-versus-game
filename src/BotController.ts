import { Player } from "./Player.js";

export class BotController {
    private bot: Player;
    private readonly target: Player;
    private canAttack: boolean = true;

    constructor(bot: Player, target: Player) {
        this.bot = bot;
        this.target = target;
    }

    update(): void {
        const distanceToTarget = this.bot.x - (this.target.x + this.target.width);
        const inAttackRange = this.bot.isInRange(this.target);

        if (inAttackRange && this.canAttack) {
            this.bot.attack(this.target);
            this.canAttack = false;
            setTimeout(() => this.canAttack = true, 1000);
            return;
        }

        if (distanceToTarget > this.bot.attackRange) {
            if(!this.bot.onGround) return;
            const nextX = this.bot.x - this.bot.step;
            if (nextX > this.target.x + this.target.width) {
                this.bot.moveLeft();
            }
        }
    }
}