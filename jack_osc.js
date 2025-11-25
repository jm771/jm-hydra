function doVisual(oscilator) {
// One of the default hydra visuals
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Olivia Jack
// https://ojack.github.io
 osc(6, 0, 0.8)
  .color(1.14, 0.6,.80)
  .rotate(0.92, 0.3)
  .pixelate(20, 10)
  .mult(oscilator.thresh(0.4).rotate(0, -0.02))
  .modulateRotate(osc(20, 0).thresh(0.3, 0.6), () => 1)
  .out(o0) 
}

setFunction({
    name: 'jackSin',
    type: 'color',
    inputs: [],
    glsl: `
        return 0.5 * (1.0 + sin(_c0 * 3.1415926 * 2.0));
    `
})

setFunction({
  name: 'jackCombine',
  type: 'combine',
  inputs: [{ name: 'speed', type: 'float', default: 0.01 }],
  glsl:
`return _c0.b > 0.5 ? vec4(fract(_c0.r + speed), 0, 0, 1) : vec4(_c1.r, 0, 0, 1);`
})

function jackOsc(buffer, frq, scroll) {
    const freqAdj = (typeof frq === 'function') ? () => 0.01 * frq() : 0.01 * frq;
  	const scrollAdj = (typeof scroll === 'function') ? () => -0.01 * scroll() : -0.01 * scroll;
	const mask = gradient(0).r().thresh(0.005, 0).invert().color(0, 0, 1)
	src(buffer).add(mask).jackCombine(src(buffer).scrollX(scrollAdj, 0), freqAdj).out(buffer)
	const jackSinOsc = src(buffer).r().jackSin()
	return jackSinOsc;
}

const jacksVer = jackOsc(o2, () =>mouse.x / 100, () => (mouse.y / 2000) + 0.02)
const builtInVer = osc(() =>mouse.x / 10, () => (-mouse.y / 1000))

//jacksVer.rotate().out()
//builtInVer.out()
//doVisual(builtInVer)
doVisual(jacksVer)

