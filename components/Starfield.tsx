"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_mouseStrength;
  uniform float u_time;

  #define PI 3.14159265359

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
               mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = rotation * p * 2.03 + 17.17;
      amplitude *= 0.5;
    }
    return value;
  }

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  float ribbon(vec2 p, float offset, float speed, float frequency, float width, float time) {
    float warp = (fbm(p * 1.45 + vec2(time * speed, offset * 5.0)) - 0.5) * 0.68;
    warp += sin(p.x * frequency + time * speed * 7.0 + offset * 8.0) * 0.12;
    float axis = p.y + warp + offset;
    return exp(-abs(axis) * width);
  }

  void main() {
    vec2 resolution = max(u_resolution, vec2(1.0));
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    vec2 mouse = (u_mouse - 0.5 * resolution.xy) / resolution.y;
    float time = u_time * 0.12;

    vec2 delta = uv - mouse;
    float mouseDistance = length(delta);
    float influence = exp(-mouseDistance * mouseDistance * 5.5) * u_mouseStrength;
    delta = rotate2d(influence * 1.75) * delta;
    uv = mouse + delta;
    uv += normalize(delta + 0.0001) * sin(mouseDistance * 34.0 - time * 9.0) * influence * 0.026;

    vec2 q = vec2(
      fbm(uv * 1.55 + vec2(time * 0.18, -time * 0.12)),
      fbm(uv * 1.55 + vec2(5.2 - time * 0.1, 1.3 + time * 0.16))
    );
    vec2 r = vec2(
      fbm(uv * 2.0 + q * 3.2 + vec2(1.7, 9.2) + time * 0.14),
      fbm(uv * 2.0 + q * 3.0 + vec2(8.3, 2.8) - time * 0.11)
    );
    float flow = fbm(uv * 1.7 + r * 3.8 + q * 1.3);

    vec2 field = uv;
    field.y += (flow - 0.5) * 0.36;
    field = rotate2d(-0.13) * field;

    float bandA = ribbon(field, 0.34, 0.34, 4.0, 7.5, time);
    float bandB = ribbon(field * vec2(1.0, 1.12), -0.03, -0.25, 5.2, 10.0, time);
    float bandC = ribbon(field * vec2(1.0, 0.92), -0.4, 0.2, 3.3, 8.5, time);
    float filaments = ribbon(field + r * 0.12, 0.11, 0.48, 8.0, 23.0, time);
    filaments += ribbon(field - q * 0.1, -0.22, -0.38, 9.0, 27.0, time);

    vec3 deep = vec3(0.001, 0.003, 0.012);
    vec3 teal = vec3(0.008, 0.04, 0.15);
    vec3 ice = vec3(0.035, 0.15, 0.46);
    vec3 signal = vec3(0.08, 0.38, 1.0);
    vec3 color = deep;
    color += teal * bandA * (0.24 + flow * 0.48);
    color += ice * bandB * (0.15 + q.x * 0.34);
    color += teal * bandC * 0.34;
    color += mix(ice, signal, smoothstep(0.35, 0.8, flow)) * filaments * 0.42;

    float energy = pow(max(0.0, sin((flow + q.x * 0.5 + uv.x * 0.3) * 15.0 - time * 2.1)), 10.0);
    color += signal * energy * (bandA + bandB + bandC) * 0.32;

    vec2 particleGrid = floor((uv + vec2(time * 0.012, -time * 0.025)) * 34.0);
    vec2 particleCell = fract((uv + vec2(time * 0.012, -time * 0.025)) * 34.0) - 0.5;
    float seed = hash21(particleGrid);
    float particle = smoothstep(0.09, 0.0, length(particleCell)) * step(0.91, seed);
    float flicker = 0.35 + 0.65 * sin(time * (2.0 + seed * 3.0) + seed * 40.0);
    color += mix(ice, signal, step(0.975, seed)) * particle * max(0.0, flicker) * 0.9;

    float lensRing = exp(-abs(mouseDistance - 0.055 - sin(time * 1.7) * 0.004) * 145.0) * u_mouseStrength;
    float lensCore = exp(-mouseDistance * 11.0) * u_mouseStrength;
    color += signal * lensRing * 0.26;
    color += teal * lensCore * 0.14;

    float vignette = 1.0 - smoothstep(0.42, 1.08, length(uv * vec2(0.78, 1.0)));
    color *= 0.31 + vignette * 0.56;
    color = pow(color, vec3(1.12));
    gl_FragColor = vec4(color, 0.97);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "high-performance" });
    if (!gl) { canvas.classList.add("is-fallback"); return; }

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) { canvas.classList.add("is-fallback"); return; }
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.classList.add("is-fallback"); return; }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const strengthLocation = gl.getUniformLocation(program, "u_mouseStrength");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.5, targetX: window.innerWidth * 0.7, targetY: window.innerHeight * 0.5, strength: 0, active: false };
    let animation = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (time = 0) => {
      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.045;
      const scaleX = canvas.width / window.innerWidth;
      const scaleY = canvas.height / window.innerHeight;
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, pointer.x * scaleX, (window.innerHeight - pointer.y) * scaleY);
      gl.uniform1f(strengthLocation, pointer.strength);
      gl.uniform1f(timeLocation, reduced ? 1400 : time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced) animation = requestAnimationFrame(render);
    };

    const move = (event: PointerEvent) => { pointer.targetX = event.clientX; pointer.targetY = event.clientY; pointer.active = true; };
    const leave = () => { pointer.active = false; };
    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield magnetic-aurora" aria-hidden="true" />;
}
