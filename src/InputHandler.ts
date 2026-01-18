export type KeyCallback = (key: string) => void;

export class InputHandler {
    private onKeyDown: KeyCallback | null = null;

    constructor() {
        window.addEventListener("keydown", (e) => {
            if (this.onKeyDown) {
                this.onKeyDown(e.key);
            }
        });
    }

    setOnKeyDown(callback: KeyCallback): void {
        this.onKeyDown = callback;
    }
}