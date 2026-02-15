import React, { useEffect } from 'react';

// 1. Store the shader as a string using backticks
const fragmentShader = `#version 300 es
    precision highp float;
    out vec4 glFragColor;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec4 u_background;
    uniform vec4 u_color;
    uniform float u_speed;
    uniform float u_phase;
    uniform float u_scale;
    uniform float u_brightness;

    vec2 rotate(vec2 uv, float th) {
      return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
    }

    float neuro_shape(vec2 uv, float t) {
      vec2 sine_acc = vec2(0.);
      vec2 res = vec2(0.);
      float scale = 8.;
      for (int j = 0; j < 15; j++) {
        uv = rotate(uv, 1.);
        sine_acc = rotate(sine_acc, 1.);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer);
        res += (.5 + .5 * cos(layer)) / scale;
        scale *= (1.2);
      }
      return res.x + res.y;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv -= .5;
      float scale = .75 * u_scale + 1e-4;
      uv *= (.001 * (1. - step(1. - scale, 1.) / scale));
      uv *= u_resolution;
      uv += .5;
      float t = u_time * u_speed + u_phase * 10.;
      float noise = neuro_shape(uv, t);
      noise = u_brightness * pow(noise, 3.);
      noise += pow(noise, 12.);
      noise = max(.0, noise - .5);
      
      vec3 color = mix(u_background.rgb * u_background.a, u_color.rgb * u_color.a, noise);
      float opacity = mix(u_background.a, u_color.a, noise);
      glFragColor = vec4(color, opacity);
    }
`;

// 2. Stringify the uniforms so the custom element can parse them easily
const uniforms = JSON.stringify({
  u_background: [0, 0, 0, 1],
  u_color: [0, 1, 0.01568627450980392, 1],
  u_scale: 1,
  u_speed: 1,
  u_phase: 0.5,
  u_brightness: 1
});

const ShaderBackground = () => {
  useEffect(() => {
    // 3. Dynamically inject the web component script exactly once
    const scriptId = 'media-shader-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/media-shader@latest/media-shader.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,           // Forces the container behind your other React components
      pointerEvents: 'none' // Prevents the canvas from blocking mouse clicks
    }}>
      {/* 4. Render the custom web component */}
      <media-shader
        width="100%"
        height="100%"
        fragment-shader={fragmentShader}
        uniforms={uniforms}
      ></media-shader>
    </div>
  );
};

export default ShaderBackground;