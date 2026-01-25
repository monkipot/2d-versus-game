export interface Fighter {
    x: number;
    y: number;
    width: number;
    health: number;
    strength: number;
    attackRange: number;
    isAttacking(): boolean;
    isParrying(): boolean;
    isJumping(): boolean;
}