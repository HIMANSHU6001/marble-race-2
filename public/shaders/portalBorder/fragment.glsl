uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;
void main()
{
    vec3 color = mix(uColorStart, uColorEnd, 1.0);
    gl_FragColor = vec4(vUv,1.0, 1.0);
}