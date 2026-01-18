export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class WebGLRender {
    private gl: WebGLRenderingContext;
    private readonly program: WebGLProgram;
    private readonly positionBuffer: WebGLBuffer;
    private readonly positionLocation: number;
    private readonly resolutionLocation: WebGLUniformLocation;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.program = this.createProgram();
        this.positionBuffer = gl.createBuffer()!;
        this.positionLocation = gl.getAttribLocation(this.program, "vertex_position");
        this.resolutionLocation = gl.getUniformLocation(this.program, "canva_size")!;
    }

    private createProgram(): WebGLProgram {
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

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fsSource);

        const program = this.gl.createProgram()!;
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        return program;
    }

    private createShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        return shader;
    }

    clear(): void {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    drawRectangle(rect: Rectangle): void {
        this.gl.useProgram(this.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        const { x, y, width, height } = rect;
        const positions = new Float32Array([
            x, y, x + width, y, x, y + height,
            x, y + height, x + width, y, x + width, y + height
        ]);

        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniform2f(this.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}