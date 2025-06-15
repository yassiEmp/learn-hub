import React, { useRef, useEffect, useState } from 'react';

interface ShaderBackgroundProps {
  className?: string;
}

export const ShaderBackground: React.FC<ShaderBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);

  const vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `;

  const fragmentShaderSource = `
   #ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Beam parameters fixed
const float BEAM_WIDTH = 0.08;
const float BEAM_INTENSITY = 0.440;
const float BOTTOM_SPREAD = 0.370;
const float GLOW_INTENSITY = 1.052;

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float val = 0.416;
    float amp = 0.556;
    for(int i = 0; i < 5; i++){
        val += amp * noise(st);
        st *= 2.848;
        amp *= 0.140;
    }
    return val;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;
    float centerX = (u_resolution.x / u_resolution.y) * 0.5;
    float x = uv.x - centerX;

    // Beam geometry (funnel)
    float topW = BEAM_WIDTH * 0.034;
    float bottomW = BEAM_WIDTH * BOTTOM_SPREAD * 91.696;
    float t = pow(1.0 - uv.y, 16.916);
    float beamW = mix(topW, bottomW, t);
    float mask = smoothstep(beamW, beamW * 0.9, abs(x)); // soft edges

    // Core & glow
    float core = 1.0 / (1.0 + pow(abs(x) / (beamW * 0.3), 12.0));
    float inner = 1.0 / (1.0 + pow(abs(x) / (beamW * 0.8), 4.0));
    float outer = 1.0 / (1.0 + pow(abs(x) / (beamW * 2.5), 1.5));

    // Vertical falloff
    float vert = pow(1.0 - uv.y, 0.5);

    // Add subtle noise for flicker
    float flicker = fbm(vec2(x * 5.0, uv.y * 2.0 + u_time * 2.0)) * 0.05;

    // Color composition
    vec3 coreColor = vec3(0.130,0.875,1.000);
    vec3 innerColor = vec3(1.000,0.571,0.769);
    vec3 outerColor = vec3(0.010,0.990,1.000);
    vec3 bg = vec3(0.01, 0.02, 0.05);

    vec3 col = bg;
    col += coreColor * core * BEAM_INTENSITY * vert;
    col += innerColor * inner * GLOW_INTENSITY * vert;
    col += outerColor * outer * (GLOW_INTENSITY * 0.584) * vert;
    col += flicker;

    // Vignette for depth
    float vig = smoothstep(1.0, 0.308, length(uv - vec2(centerX, 0.500)));
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
}

  `;

  const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Error linking program:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    // Set up geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const render = (time: number) => {
      resizeCanvas();

      gl.useProgram(program);

      // Set uniforms
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time * 0.001);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationRef.current = requestAnimationFrame(render);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(render);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        
        const gl = glRef.current;
        if (gl) {
          gl.viewport(0, 0, canvas.width, canvas.height);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
};