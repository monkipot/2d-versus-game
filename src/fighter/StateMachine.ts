import { GameConfig } from "../config/GameConfig.js";
import { FighterState } from "./state.js";

export class StateMachine {
    private state: FighterState = FighterState.Idle;
    private stateTimer: number = 0;

    currentState(): FighterState {
        return this.state;
    }

    isAttacking(): boolean {
        return this.state === FighterState.Attacking;
    }

    isParrying(): boolean {
        return this.state === FighterState.Parrying;
    }

    isJumping(): boolean {
        return this.state === FighterState.Jumping;
    }

    update(deltaTime: number): void {
        if (this.stateTimer > 0) {
            this.stateTimer -= deltaTime;
            if (this.stateTimer <= 0) {
                this.transitionTo(FighterState.Idle);
            }
        }
    }

    canTransitionTo(newState: FighterState): boolean {
        if (this.state === newState) return false;

        switch (this.state) {
            case FighterState.Idle:
                return true;
            case FighterState.Attacking:
                return false;
            case FighterState.Parrying:
                return newState === FighterState.Idle;
            case FighterState.Jumping:
                return newState !== FighterState.Jumping;
            default:
                return false;
        }
    }

    transitionTo(newState: FighterState): boolean {
        if (newState === FighterState.Idle || this.canTransitionTo(newState)) {
            this.state = newState;
            this.stateTimer = this.getStateDuration(newState);
            return true;
        }
        return false;
    }

    private getStateDuration(state: FighterState): number {
        switch (state) {
            case FighterState.Attacking:
                return GameConfig.player.attackDuration;
            default:
                return 0;
        }
    }
}
