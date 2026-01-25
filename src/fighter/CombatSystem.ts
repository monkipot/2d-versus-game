import type { Fighter } from "./fighter.js";

export class CombatSystem {
    isInRange(attacker: Fighter, defender: Fighter): boolean {
        const gap = Math.max(attacker.position.x, defender.position.x)
            - Math.min(attacker.position.x + attacker.dimension.width, defender.position.x + defender.dimension.width);
        return gap <= attacker.combat.attackRange;
    }

    attack(attacker: Fighter, defender: Fighter): void {
        if (!this.isInRange(attacker, defender)) return;

        const damage = defender.isParrying()
            ? attacker.combat.strength * 0.2
            : attacker.combat.strength;

        defender.combat.health -= damage;
    }
}
