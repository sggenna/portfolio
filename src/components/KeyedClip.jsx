import { useEffect, useRef, useState } from 'react';
import { useEnv } from '../hooks/useEnv.js';

// MP4s can't be transparent, so this drops a video's black background as it plays. UI text can be
// just as black, so brightness alone can't tell them apart. Each frame, a small mask is flood-filled
// in from the edges: only black that reaches the outside goes, and anything a window encloses stays.
// Without WebGL, it's a plain video.
const MASK_W = 480;
const MASK_H = 270;
const DARK = 14; // the brightest a background pixel gets, out of 255
const GROW = 2; // the mask's pixels are coarse, so grow it to reach the windows' edges

const VERT = 'attribute vec2 p; varying vec2 uv; void main() { uv = vec2((p.x + 1.0) / 2.0, (1.0 - p.y) / 2.0); gl_Position = vec4(p, 0.0, 1.0); }';
const FRAG = `precision mediump float;
varying vec2 uv;
uniform sampler2D tex;
uniform sampler2D mask;
void main() {
  vec4 c = texture2D(tex, uv);
  float key = smoothstep(0.02, 0.10, max(c.r, max(c.g, c.b)));
  float a = mix(1.0, key, step(0.5, texture2D(mask, uv).r));
  gl_FragColor = vec4(c.rgb * a, a);
}`;

function texture(gl, unit) {
  const t = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function setup(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) return null;
  const shader = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  texture(gl, 1);
  gl.uniform1i(gl.getUniformLocation(prog, 'mask'), 1);
  texture(gl, 0);
  gl.uniform1i(gl.getUniformLocation(prog, 'tex'), 0);
  return gl;
}

// Marks the dark pixels connected to the frame's edge, then grows them a little.
function outsideMask(rgba, out, stack) {
  const W = MASK_W, H = MASK_H;
  out.fill(0);
  let n = 0;
  const seed = (i) => { stack[n++] = i; };
  for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
  for (let y = 1; y < H - 1; y++) { seed(y * W); seed(y * W + W - 1); }
  while (n > 0) {
    const i = stack[--n];
    if (out[i]) continue;
    const p = i * 4;
    if (rgba[p] >= DARK || rgba[p + 1] >= DARK || rgba[p + 2] >= DARK) continue;
    out[i] = 255;
    const x = i % W;
    if (x > 0 && !out[i - 1]) seed(i - 1);
    if (x < W - 1 && !out[i + 1]) seed(i + 1);
    if (i >= W && !out[i - W]) seed(i - W);
    if (i < W * (H - 1) && !out[i + W]) seed(i + W);
  }
  for (let g = 0; g < GROW; g++) {
    const was = out.slice();
    for (let i = 0; i < out.length; i++) {
      if (was[i]) continue;
      const x = i % W;
      if ((x > 0 && was[i - 1]) || (x < W - 1 && was[i + 1]) || (i >= W && was[i - W]) || (i < W * (H - 1) && was[i + W])) out[i] = 255;
    }
  }
}

export default function KeyedClip({ src, label }) {
  const { motion } = useEnv();
  const video = useRef(null);
  const canvas = useRef(null);
  const [keyed, setKeyed] = useState(true);

  useEffect(() => {
    const v = video.current;
    const c = canvas.current;
    const gl = c && setup(c);
    if (!gl) { setKeyed(false); return undefined; }
    const small = document.createElement('canvas');
    small.width = MASK_W;
    small.height = MASK_H;
    const ctx = small.getContext('2d', { willReadFrequently: true });
    const mask = new Uint8Array(MASK_W * MASK_H);
    const stack = new Int32Array(MASK_W * MASK_H * 4);
    const draw = () => {
      if (v.readyState < 2) return;
      if (c.width !== v.videoWidth) {
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        gl.viewport(0, 0, c.width, c.height);
      }
      ctx.drawImage(v, 0, 0, MASK_W, MASK_H);
      outsideMask(ctx.getImageData(0, 0, MASK_W, MASK_H).data, mask, stack);
      gl.activeTexture(gl.TEXTURE1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, MASK_W, MASK_H, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, mask);
      gl.activeTexture(gl.TEXTURE0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const byFrame = 'requestVideoFrameCallback' in v;
    let id = 0;
    const loop = () => {
      draw();
      id = byFrame ? v.requestVideoFrameCallback(loop) : requestAnimationFrame(loop);
    };
    id = byFrame ? v.requestVideoFrameCallback(loop) : requestAnimationFrame(loop);
    v.addEventListener('loadeddata', draw);
    v.addEventListener('seeked', draw);
    return () => {
      v.removeEventListener('loadeddata', draw);
      v.removeEventListener('seeked', draw);
      if (byFrame) v.cancelVideoFrameCallback(id); else cancelAnimationFrame(id);
    };
  }, [src]);

  useEffect(() => {
    const v = video.current;
    if (!v || !motion) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play()?.catch(() => {}); else v.pause();
    }, { threshold: 0.05 });
    io.observe(v.parentElement);
    return () => io.disconnect();
  }, [motion, src]);

  return (
    <div style={{ position: 'relative' }}>
      <video ref={video} src={src} muted loop playsInline preload="auto" controls={!motion} aria-label={label} style={keyed && motion ? { opacity: 0 } : undefined} />
      {keyed && motion && <canvas ref={canvas} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />}
    </div>
  );
}
