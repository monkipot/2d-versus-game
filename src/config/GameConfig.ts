//TODO: could be refine
export const GameConfig = {
    physics: {
        gravity: 0.5,
        jumpForce: -12,
        groundOffset: 125,
    },
    player: {
        width: 60,
        height: 150,
        step: 10,
        initialHealth: 100,
        strength: 10,
        attackRange: 20,
        attackDuration: 300,
    },
    bot: {
        attackCooldown: 1000,
    },
    audio: {
        attack: { frequency: 100, duration: 0.1, type: 'sawtooth' },
        jump: { frequency: 500, duration: 0.1, type: 'triangle' },
        parry: { frequency: 1000, duration: 0.05, type: 'square' },
    },
} as const;