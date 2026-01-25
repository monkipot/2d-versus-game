import type { Fighter } from "./fighter.js";

export class FightEngine {
    isInRange(attacker: Fighter, defender: Fighter): boolean {
        const gap = Math.max(attacker.x, defender.x) - Math.min(attacker.x + attacker.width, defender.x + defender.width);
        return gap <= attacker.attackRange;
    }

    attack(attacker: Fighter, defender: Fighter): void {
        if (!this.isInRange(attacker, defender)) return;

        const damage = defender.isParrying()
            ? attacker.strength * 0.2
            : attacker.strength;

        defender.health -= damage;
    }
}
