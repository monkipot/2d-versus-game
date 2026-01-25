import { GameConfig } from "./config/GameConfig.js";

/**
 * https://developer.mozilla.org/fr/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
 */
export class AudioManager {
    private ctx: AudioContext;

    constructor() {
        this.ctx = new AudioContext();
    }

    private playTone(frequency: number, duration: number, type: OscillatorType): void {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = type;
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    attack(): void {
        const { frequency, duration, type } = GameConfig.audio.attack;
        this.playTone(frequency, duration, type);
    }

    jump(): void {
        const { frequency, duration, type } = GameConfig.audio.jump;
        this.playTone(frequency, duration, type);
    }

    parry(): void {
        const { frequency, duration, type } = GameConfig.audio.parry;
        this.playTone(frequency, duration, type);
    }
}