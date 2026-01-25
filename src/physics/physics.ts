export interface PhysicsEntity {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityY: number;
    onGround: boolean;
}

export interface Bounds {
    width: number;
    height: number;
}
