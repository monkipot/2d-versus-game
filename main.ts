/**
 * https://developer.mozilla.org/fr/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
 */
class Game {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;

    constructor() {
        const canvas = document.querySelector<HTMLCanvasElement>("#glCanvas");
        if (!canvas) {
            throw new Error("Cant retrieve canva element");
        }
        const gl = canvas.getContext("webgl");

        if (!gl) {
            throw new Error("WebGL isnt supported");
        }

        this.canvas = canvas;
        this.gl = gl;
    }

    render(): void {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}

const game = new Game();
game.render();