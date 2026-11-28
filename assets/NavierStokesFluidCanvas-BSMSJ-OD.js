import{r as y,j as se}from"./react-DxdQDRP7.js";import{h as $}from"./index-BM8sXQ6m.js";import"./motion-Cwj57GQ2.js";import"./data-CG7E6o9X.js";const h=256,Z=512,fe=14,S=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,ce=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main() {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + splat, 1.0);
}
`,ve=`#version 300 es
precision highp float;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  fragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`,le=`#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curlStrength;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curlStrength * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy + force * dt;
  vel = clamp(vel, vec2(-1000.0), vec2(1000.0));
  fragColor = vec4(vel, 0.0, 1.0);
}
`,me=`#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  float div = 0.5 * (R - L + T - B);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`,de=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float value;
void main() {
  fragColor = value * texture(uTexture, vUv);
}
`,xe=`#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  fragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`,pe=`#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}
`,Re=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  vec4 result = texture(uSource, coord);
  float decay = 1.0 + dissipation * dt;
  fragColor = result / decay;
}
`,Ee=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float isPaper;
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  float lum = max(c.r, max(c.g, c.b));
  float alpha = clamp(lum * mix(0.85, 0.58, isPaper), 0.0, 0.85);
  vec3 toned = mix(c, c * 0.72, isPaper);
  fragColor = vec4(toned * alpha, alpha);
}
`;function A(r,v,l){const o=r.createShader(r.VERTEX_SHADER),s=r.createShader(r.FRAGMENT_SHADER);if(!o||!s)return null;if(r.shaderSource(o,v),r.compileShader(o),!r.getShaderParameter(o,r.COMPILE_STATUS)||(r.shaderSource(s,l),r.compileShader(s),!r.getShaderParameter(s,r.COMPILE_STATUS)))return r.deleteShader(o),r.deleteShader(s),null;const n=r.createProgram();if(!n)return null;if(r.attachShader(n,o),r.attachShader(n,s),r.linkProgram(n),r.deleteShader(o),r.deleteShader(s),!r.getProgramParameter(n,r.LINK_STATUS))return r.deleteProgram(n),null;const E={},a=r.getProgramParameter(n,r.ACTIVE_UNIFORMS);for(let m=0;m<a;m++){const e=r.getActiveUniform(n,m);e&&(E[e.name]=r.getUniformLocation(n,e.name))}return{program:n,uniforms:E}}function O(r,v,l,o,s,n,E){const a=r.createTexture(),m=r.createFramebuffer();if(!a||!m)return null;r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,a),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,E),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,E),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,o,v,l,0,s,n,null),r.bindFramebuffer(r.FRAMEBUFFER,m),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,a,0);const e=r.checkFramebufferStatus(r.FRAMEBUFFER);return r.bindFramebuffer(r.FRAMEBUFFER,null),e!==r.FRAMEBUFFER_COMPLETE?(r.deleteFramebuffer(m),r.deleteTexture(a),null):{texture:a,fbo:m,width:v,height:l,texelSizeX:1/v,texelSizeY:1/l}}function H(r,v,l,o,s,n,E){const a=O(r,v,l,o,s,n,E),m=O(r,v,l,o,s,n,E);return!a||!m?null:{read:a,write:m,swap(){const e=this.read;this.read=this.write,this.write=e}}}function Le({enabled:r,theme:v,accentHex:l,onTelemetryChange:o}){const s=y.useRef(null),n=y.useRef(v==="paper"?1:0),E=y.useRef($(l));return y.useEffect(()=>{n.current=v==="paper"?1:0},[v]),y.useEffect(()=>{E.current=$(l)},[l]),y.useEffect(()=>{const a=s.current;if(!a)return;if(!r){o?.({active:!1,label:"PAUSED"});return}if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){o?.({active:!1,label:"REDUCED MOTION"});return}const e=a.getContext("webgl2",{alpha:!0,depth:!1,stencil:!1,antialias:!1,premultipliedAlpha:!0,preserveDrawingBuffer:!1});if(!e){o?.({active:!1,label:"FALLBACK"});return}if(!e.getExtension("EXT_color_buffer_float")){o?.({active:!1,label:"FALLBACK (NO FLOAT FBO)"});return}const W=e.getExtension("OES_texture_float_linear")?e.LINEAR:e.NEAREST,d=A(e,S,ce),w=A(e,S,ve),F=A(e,S,le),C=A(e,S,me),U=A(e,S,de),_=A(e,S,xe),b=A(e,S,pe),x=A(e,S,Re),B=A(e,S,Ee),K=[d,w,F,C,U,_,b,x,B];if(K.some(i=>!i)){o?.({active:!1,label:"SHADER FALLBACK"});return}const t=H(e,h,h,e.RG16F,e.RG,e.HALF_FLOAT,W),p=H(e,Z,Z,e.RGBA16F,e.RGBA,e.HALF_FLOAT,W),D=O(e,h,h,e.R16F,e.RED,e.HALF_FLOAT,e.NEAREST),z=O(e,h,h,e.R16F,e.RED,e.HALF_FLOAT,e.NEAREST),R=H(e,h,h,e.R16F,e.RED,e.HALF_FLOAT,e.NEAREST);if(!t||!p||!D||!z||!R){o?.({active:!1,label:"FBO FALLBACK"});return}const M=e.createVertexArray(),X=e.createBuffer();e.bindVertexArray(M),e.bindBuffer(e.ARRAY_BUFFER,X),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,-1,-1,1,1,1,-1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null);const T=i=>{i?(e.viewport(0,0,i.width,i.height),e.bindFramebuffer(e.FRAMEBUFFER,i.fbo)):(e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.bindFramebuffer(e.FRAMEBUFFER,null)),e.bindVertexArray(M),e.drawArrays(e.TRIANGLES,0,6)},f=(i,u)=>{e.activeTexture(e.TEXTURE0+i),e.bindTexture(e.TEXTURE_2D,u)},I=()=>{const i=Math.min(window.devicePixelRatio||1,1.5);a.width=Math.max(320,Math.floor(window.innerWidth*i)),a.height=Math.max(320,Math.floor(window.innerHeight*i))};I(),window.addEventListener("resize",I,{passive:!0});const P=[];let g=-1,N=-1,k=0;const j=i=>{const u=i.clientX/Math.max(1,window.innerWidth),c=1-i.clientY/Math.max(1,window.innerHeight);if(g<0){g=u,N=c;return}const V=(u-g)*5400,L=(c-N)*5400;g=u,N=c,Math.abs(V)+Math.abs(L)>1.2&&(P.push({x:u,y:c,dx:V,dy:L}),P.length>6&&P.shift())};window.addEventListener("pointermove",j,{passive:!0}),P.push({x:.72,y:.56,dx:-160,dy:90,boost:.55}),P.push({x:.24,y:.48,dx:130,dy:-85,boost:.42}),o?.({active:!0,label:"FBO 256² · 14-JACOBI"});const ee=(i,u,c,V,L=1)=>{const re=a.width/Math.max(1,a.height);k+=.14;const[te,ie,oe]=E.current,Y=.5+.5*Math.sin(k),ae=(te*.72+.14*(1-Y))*.42*L,ne=(ie*.65+.34*Y)*.42*L,ue=(oe*.72+.58*Y)*.42*L;e.useProgram(d.program),f(0,t.read.texture),e.uniform1i(d.uniforms.uTarget,0),e.uniform1f(d.uniforms.aspectRatio,re),e.uniform2f(d.uniforms.point,i,u),e.uniform3f(d.uniforms.color,c,V,0),e.uniform1f(d.uniforms.radius,.0028),e.uniform2f(d.uniforms.texelSize,t.read.texelSizeX,t.read.texelSizeY),T(t.write),t.swap(),f(0,p.read.texture),e.uniform1i(d.uniforms.uTarget,0),e.uniform3f(d.uniforms.color,ae,ne,ue),e.uniform1f(d.uniforms.radius,.0042),e.uniform2f(d.uniforms.texelSize,p.read.texelSizeX,p.read.texelSizeY),T(p.write),p.swap()};let G=0,q=!1,J=performance.now();const Q=i=>{if(q||(G=requestAnimationFrame(Q),document.hidden))return;const u=Math.min(.0167,Math.max(.004,(i-J)*.001));for(J=i,e.disable(e.BLEND);P.length>0;){const c=P.shift();ee(c.x,c.y,c.dx,c.dy,c.boost??1)}e.useProgram(w.program),e.uniform2f(w.uniforms.texelSize,t.read.texelSizeX,t.read.texelSizeY),f(0,t.read.texture),e.uniform1i(w.uniforms.uVelocity,0),T(z),e.useProgram(F.program),e.uniform2f(F.uniforms.texelSize,t.read.texelSizeX,t.read.texelSizeY),f(0,t.read.texture),e.uniform1i(F.uniforms.uVelocity,0),f(1,z.texture),e.uniform1i(F.uniforms.uCurl,1),e.uniform1f(F.uniforms.curlStrength,24),e.uniform1f(F.uniforms.dt,u),T(t.write),t.swap(),e.useProgram(C.program),e.uniform2f(C.uniforms.texelSize,t.read.texelSizeX,t.read.texelSizeY),f(0,t.read.texture),e.uniform1i(C.uniforms.uVelocity,0),T(D),e.useProgram(U.program),e.uniform2f(U.uniforms.texelSize,R.read.texelSizeX,R.read.texelSizeY),f(0,R.read.texture),e.uniform1i(U.uniforms.uTexture,0),e.uniform1f(U.uniforms.value,.8),T(R.write),R.swap(),e.useProgram(_.program),e.uniform2f(_.uniforms.texelSize,t.read.texelSizeX,t.read.texelSizeY),f(1,D.texture),e.uniform1i(_.uniforms.uDivergence,1);for(let c=0;c<fe;c++)f(0,R.read.texture),e.uniform1i(_.uniforms.uPressure,0),T(R.write),R.swap();e.useProgram(b.program),e.uniform2f(b.uniforms.texelSize,t.read.texelSizeX,t.read.texelSizeY),f(0,R.read.texture),e.uniform1i(b.uniforms.uPressure,0),f(1,t.read.texture),e.uniform1i(b.uniforms.uVelocity,1),T(t.write),t.swap(),e.useProgram(x.program),e.uniform2f(x.uniforms.texelSize,t.read.texelSizeX,t.read.texelSizeY),f(0,t.read.texture),e.uniform1i(x.uniforms.uVelocity,0),f(1,t.read.texture),e.uniform1i(x.uniforms.uSource,1),e.uniform1f(x.uniforms.dt,u),e.uniform1f(x.uniforms.dissipation,.45),T(t.write),t.swap(),e.uniform2f(x.uniforms.texelSize,t.read.texelSizeX,t.read.texelSizeY),f(0,t.read.texture),e.uniform1i(x.uniforms.uVelocity,0),f(1,p.read.texture),e.uniform1i(x.uniforms.uSource,1),e.uniform1f(x.uniforms.dt,u),e.uniform1f(x.uniforms.dissipation,1.55),T(p.write),p.swap(),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.clearColor(0,0,0,0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(B.program),e.uniform2f(B.uniforms.texelSize,1/a.width,1/a.height),f(0,p.read.texture),e.uniform1i(B.uniforms.uTexture,0),e.uniform1f(B.uniforms.isPaper,n.current),T(null)};return G=requestAnimationFrame(Q),()=>{q=!0,cancelAnimationFrame(G),window.removeEventListener("resize",I),window.removeEventListener("pointermove",j);const i=u=>{e.deleteFramebuffer(u.fbo),e.deleteTexture(u.texture)};i(t.read),i(t.write),i(p.read),i(p.write),i(R.read),i(R.write),i(D),i(z),X&&e.deleteBuffer(X),M&&e.deleteVertexArray(M),K.forEach(u=>{u&&e.deleteProgram(u.program)})}},[r,o]),se.jsx("canvas",{ref:s,"aria-hidden":"true","data-testid":"navier-stokes-canvas",className:`fixed inset-0 w-full h-full z-[1] pointer-events-none transition-opacity duration-500 ${r?"opacity-[0.42]":"opacity-0"}`})}export{Le as NavierStokesFluidCanvas};
