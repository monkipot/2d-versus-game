export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class WebGLRender {
    private gl: WebGLRenderingContext;
    private readonly program: WebGLProgram;
    private readonly backgroundProgram: WebGLProgram;
    private readonly positionBuffer: WebGLBuffer;
    private readonly positionLocation: number;
    private readonly resolutionLocation: WebGLUniformLocation;
    private backgroundTexture: WebGLTexture | null = null;
    private backgroundLoaded: boolean = false;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.program = this.createProgram();
        this.backgroundProgram = this.createBackgroundProgram();
        this.positionBuffer = gl.createBuffer()!;
        this.positionLocation = gl.getAttribLocation(this.program, "vertex_position");
        this.resolutionLocation = gl.getUniformLocation(this.program, "canva_size")!;
    }

    loadBackground(): void {
        this.backgroundTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.backgroundTexture);

        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 255])
        );

        const image = new Image();
        image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.backgroundTexture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.backgroundLoaded = true;
        };
        image.src = "assets/arena.png";
    }

    private createBackgroundProgram(): WebGLProgram {
        const vsSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        const fsSource = `
            precision mediump float;
            uniform sampler2D u_texture;
            varying vec2 v_texCoord;
            void main() {
                gl_FragColor = texture2D(u_texture, v_texCoord);
            }
        `;

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fsSource);
        const program = this.gl.createProgram();

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        return program;
    }

    drawBackground(): void {
        if (!this.backgroundLoaded || !this.backgroundTexture) return;

        this.gl.useProgram(this.backgroundProgram);

        const positionLocation = this.gl.getAttribLocation(this.backgroundProgram, "a_position");
        const texCoordLocation = this.gl.getAttribLocation(this.backgroundProgram, "a_texCoord");

        const positions = new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]);

        const texCoords = new Float32Array([
            0, 1, 1, 1, 0, 0,
            0, 0, 1, 1, 1, 0
        ]);

        const posBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        const texBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(texCoordLocation);
        this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.backgroundTexture);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        this.gl.disableVertexAttribArray(positionLocation);
        this.gl.disableVertexAttribArray(texCoordLocation);
        this.gl.deleteBuffer(posBuffer);
        this.gl.deleteBuffer(texBuffer);
    }

    private createProgram(): WebGLProgram {
        const vsSource = `
            attribute vec2 vertex_position;
            uniform vec2 canva_size;
            void main() {
                vec2 normalized_position = vertex_position / canva_size;
                vec2 clip_space_position = normalized_position * 2.0 - 1.0;
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

    drawPlayer(rect: Rectangle, isAttacking: boolean, isParrying: boolean): void {
        this.drawHead(rect);
        this.drawTorso(rect);
        if (isAttacking) {
            this.drawKickingLegs(rect);
        } else {
            if(isParrying) {
                this.drawParryingArms(rect)
            }
            this.drawLegs(rect);
        }
    }

    drawHead({ x, y, width, height }: Rectangle): void {
        //TODO: draw properly without shitty values
        this.drawRectangle({
            x: (x + width * 0.5) - width * 0.25,
            y: y,
            width: width * 0.5,
            height: height * 0.2
        });
    }

    drawTorso({ x, y, width, height }: Rectangle): void {
        this.drawRectangle({
            x: (x + width * 0.5) - width * 0.5,
            y: y + height * 0.25,
            width: width,
            height: height * 0.4
        });
    }

    drawLegs({ x, y, width, height }: Rectangle): void {
        this.drawRectangle({
            x: (x + width * 0.5) - width * 0.22,
            y: y + height * 0.25 + height * 0.4,
            width: width * 0.2,
            height: height * 0.35
        });

        this.drawRectangle({
            x: x + width * 0.5 + width * 0.02,
            y: y + height * 0.25 + height * 0.4,
            width: width * 0.2,
            height: height * 0.35
        });
    }

    drawParryingArms({ x, y, width, height }: Rectangle): void {
        this.drawRectangle({
            x: x + width * 0.2 + width * 0.02,
            y: y + height * 0.4,
            width: width * 1.2,
            height: height * 0.1
        });

        this.drawRectangle({
            x: x + width * 0.2 + width * 1.2,
            y: y + height * 0.2,
            width: width * 0.2,
            height: height * 0.3
        });
    }

    drawKickingLegs({ x, y, width, height }: Rectangle): void {
        this.drawRectangle({
            x: (x + width * 0.5) - width * 0.22,
            y: y + height * 0.25 + height * 0.4,
            width: width * 0.2,
            height: height * 0.35
        });

        this.drawRectangle({
            x: x + width * 0.5,
            y: y + height * 0.5,
            width: height * 0.35,
            height: width * 0.2
        });
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