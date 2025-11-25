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

const nChannels = 20.0;

setFunction({
    name: 'jackSin',
    type: 'color',
    inputs: [],
    glsl: `
        return 0.5 * (1.0 + sin(_c0 * 3.1415926 * 2.0));
    `
})

setFunction({
  name: 'pixelMask',
  type: 'src',
  inputs: [{
      type: 'float',
      name: 'channel',
      default: 0,
    }],
  glsl:
`return _st.x < 0.005 && floor(_st.y * 20.0) == channel ? vec4(0, 0, 1, 1) : floor(_st.y * 20.0) == channel ? vec4(0, 1, 0, 1) : vec4(0, 0, 0, 0);`
})

setFunction({
  name: 'jackCombine',
  type: 'combine',
  inputs: [{ name: 'speed', type: 'float', default: 0.01 }],
  glsl:
`return _c0.b > 0.5 ? vec4(fract(_c0.r + speed), 0, 0, 1) : _c0.g > 0.5 ? vec4(_c1.r, 0, 0, 1) : _c0;`
})

class jackOsc {
 constructor(theOsc) {
   this.osc = theOsc
 }
}

class jackOscBuilder {
  constructor(buffer) {
   	this.buffer = buffer
    this.builder = src(buffer)
  }
  
  addChannel(channel, frq, scroll) {
    const freqAdj = (typeof frq === 'function') ? () => 0.01 * frq() : 0.01 * frq;
  	const scrollAdj = (typeof scroll === 'function') ? () => -0.01 * scroll() : -0.01 * scroll;
	const mask = pixelMask(channel)
	this.builder = this.builder.add(mask).jackCombine(src(this.buffer).scrollX(scrollAdj, 0), freqAdj)
    return this;
  }
  
  getOsc() {
   this.builder.out(this.buffer);
   return src(this.buffer).r().jackSin()
  }
}

const foo = new jackOscBuilder(o2)
.addChannel(7, () =>mouse.x / 200, () => (mouse.y / 4000) + 0.02)
.addChannel(4, () =>mouse.x / 100, () => (mouse.y / 2000) + 0.02)
.getOsc()


foo.out()
