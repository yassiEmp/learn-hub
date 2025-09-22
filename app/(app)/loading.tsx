"use client"
import React, { useRef, useEffect } from 'react';

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
/*
 * I believe that the code is clear enough, so I will save comments :)
 * But if you need help to understand anything, just tell me.
 * This shader is free to use as long it is distributed with credits.
 * And, yeah, you can change it.
 *
 * Author: Danguafer/Silexars
 * Soundtrack: stage7
 */
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;

float mb(vec2 p1, vec2 p0) { return (0.04)/(pow(p1.x-p0.x,2.)+pow(p1.y-p0.y,2.)); }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float ct = iTime;
	
	vec2 mbr,mbg,mbb;
	vec2 p = (2.0*fragCoord.xy-iResolution.xy)/iResolution.y;
	vec2 o = vec2(pow(p.x,2.),pow(p.y,2.));
	vec3 col = vec3(pow(2.*abs(o.x+o.y)+abs(o.x-o.y),5.));
	col = max(col,1.);
	float t=iTime;
	
	float t2=t*2.0,t3=t*3.0,s2=sin(t2),s3=sin(t3),s4=sin(t*4.0),c2=cos(t2),c3=cos(t3); // Let me extend this line a little more with an useless comment :-)
	
	mbr = mbg = mbb = vec2(0.);
	mbr += vec2(0.10*s4+0.40*c3,0.40*s2 +0.20*c3);
	mbg += vec2(0.15*s3+0.30*c2,0.10*-s4+0.30*c3);
	mbb += vec2(0.10*s3+0.50*c3,0.10*-s4+0.50*c2);
	
	col.r *= length(mbr.xy-p.xy);
	col.g *= length(mbg.xy-p.xy);
	col.b *= length(mbb.xy-p.xy);
	col   *= pow(mb(mbr,p)+mb(mbg,p)+mb(mbb,p),1.75);
	
	fragColor = vec4(col,1.);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
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
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const timeLocation = gl.getUniformLocation(program, 'iTime');

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
  }, [fragmentShaderSource, vertexShaderSource]);

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

const Loading = () => (
  <div style={{ width: "100vw", height: "100vh", position: "fixed", inset: 0, zIndex: 50 }}>
    <ShaderBackground />
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <span className="text-white text-2xl font-bold drop-shadow-lg">Loading course...</span>
    </div>
  </div>
);

export default Loading;