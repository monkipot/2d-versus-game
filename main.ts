/**
 * https://developer.mozilla.org/fr/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
 */
class Game {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    posX: number = 50;
    posY: number = 50;
    width: number = 100;
    height: number = 150;

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

        this.keyboard();
    }


    keyboard() {
        window.addEventListener("keydown", (e) => {
            const step = 1;
            switch (e.key) {
                case "ArrowLeft":
                    this.posX -= step;
                    break;
                case "ArrowRight":
                    this.posX += step;
                    break;
                case "ArrowUp":
                    this.posY -= step;
                    break;
                case "ArrowDown":
                    this.posY += step;
                    break;
            }
            this.render();
        });
    }

    render(): void {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        const vsSource = `
            attribute vec2 vertex_position;
            uniform vec2 canva_size;
            void main() {
                vec2 normalized_position = vertex_position / canva_size;
                vec2 scaled_position = normalized_position;
                vec2 clip_space_position = scaled_position;
                gl_Position = vec4(clip_space_position * vec2(1.0, -1.0), 0.0, 1.0);
            }
        `;

        const fsSource = `
            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `;

        const createShader = (type: number, source: string) => {
            const shader = this.gl.createShader(type)!;
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            return shader;
        };

        const vertexShader = createShader(this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(this.gl.FRAGMENT_SHADER, fsSource);

        const program = this.gl.createProgram()!;
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        this.gl.useProgram(program);

        const positionBuffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        const x = this.posX;
        const y = this.posY;
        const w = this.width;
        const h = this.height;
        const positions = new Float32Array([
            x, y, x + w, y, x, y + h,
            x, y + h, x + w, y, x + w, y + h
        ]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

        const positionLocation = this.gl.getAttribLocation(program, "vertex_position");
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        const resolutionLocation = this.gl.getUniformLocation(program, "canva_size");
        this.gl.uniform2f(resolutionLocation, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}

const game = new Game();
game.render();
