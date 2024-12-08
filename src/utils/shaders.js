// Shader utilities for Hot Tub Talk
// Where the magic happens! ✨

// Vertex shader for our water effect
export const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 uv;
    
    void main() {
        uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

// Fragment shader for the ripple effect
export const fragmentShaderSource = `
    precision mediump float;
    
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform sampler2D uStarField;
    uniform sampler2D uSteamTexture;
    uniform sampler2D uJetTexture;
    varying vec2 uv;

    // Noise function for natural water movement
    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
        vec2 pixel = gl_FragCoord.xy / uResolution;
        
        // Enhanced water ripple effect
        float wave = sin(pixel.x * 10.0 + uTime) * 0.001;
        wave += sin(pixel.y * 8.0 + uTime) * 0.001;
        wave += noise(pixel + uTime * 0.1) * 0.0005;
        
        // Add dynamic jet disturbance
        vec4 jetEffect = texture2D(uJetTexture, pixel);
        wave += jetEffect.r * 0.002;
        
        vec2 distortedUV = uv + vec2(wave);
        
        // Base water color
        vec4 waterColor = texture2D(uTexture, distortedUV);
        
        // Add stars
        vec4 stars = texture2D(uStarField, pixel);
        waterColor += stars.a * vec4(1.0, 1.0, 1.0, 0.5);
        
        // Add steam effect
        vec4 steam = texture2D(uSteamTexture, pixel);
        waterColor = mix(waterColor, vec4(1.0), steam.a * 0.3);
        
        // Final color with transparency
        gl_FragColor = vec4(waterColor.rgb, 0.8);
    }
`;

// Helper function to compile shaders
export function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;
}

// Helper function to create shader program
export function createShaderProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return null;
    }
    
    return program;
}

// Create and initialize textures for effects
export function createEffectTextures(gl) {
    const textures = {
        star: createTexture(gl),
        steam: createTexture(gl),
        jet: createTexture(gl)
    };
    
    return textures;
}

// Helper to create a texture
function createTexture(gl) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
} 