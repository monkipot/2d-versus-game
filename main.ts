/**
 * https://developer.mozilla.org/fr/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
 */
main();

function main() {
    const canvas = document.querySelector<HTMLCanvasElement>("#glCanvas");
    if (!canvas) {
        throw new Error("Cant retrieve canva element");
    }
    const gl = canvas.getContext("webgl");

    if (!gl) {
        throw new Error("WebGL isnt supported");
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}