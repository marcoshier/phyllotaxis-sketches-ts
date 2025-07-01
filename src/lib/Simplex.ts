/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

class Grad {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    dot2(x: number, y: number): number {
        return this.x * x + this.y * y;
    }
}

const grad3: Grad[] = [
    new Grad(1, 1), new Grad(-1, 1), new Grad(1, -1), new Grad(-1, -1),
    new Grad(1, 0), new Grad(-1, 0), new Grad(1, 0), new Grad(-1, 0),
    new Grad(0, 1), new Grad(0, -1), new Grad(0, 1), new Grad(0, -1)
];

const p: number[] = [151,160,137,91,90,15,
131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

let perm: number[] = new Array(512);
let gradP: Grad[] = new Array(512);

const F2: number = 0.5*(Math.sqrt(3)-1);
const G2: number = (3-Math.sqrt(3))/6;

export function seed(seedValue: number): void {
    if(seedValue > 0 && seedValue < 1) {
        seedValue *= 65536;
    }

    seedValue = Math.floor(seedValue);
    if(seedValue < 256) {
        seedValue |= seedValue << 8;
    }

    for(let i = 0; i < 256; i++) {
        let v: number;
        if (i & 1) {
            v = p[i] ^ (seedValue & 255);
        } else {
            v = p[i] ^ ((seedValue>>8) & 255);
        }

        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
}

seed(0);

export function simplex2(xin: number, yin: number): number {
    let n0: number, n1: number, n2: number;
    const s: number = (xin+yin)*F2;
    const i: number = Math.floor(xin+s);
    const j: number = Math.floor(yin+s);
    const t: number = (i+j)*G2;
    const x0: number = xin-i+t;
    const y0: number = yin-j+t;
    let i1: number, j1: number;
    if(x0>y0) {
        i1=1; j1=0;
    } else {
        i1=0; j1=1;
    }
    const x1: number = x0 - i1 + G2;
    const y1: number = y0 - j1 + G2;
    const x2: number = x0 - 1 + 2 * G2;
    const y2: number = y0 - 1 + 2 * G2;
    const ii: number = i & 255;
    const jj: number = j & 255;
    const gi0: Grad = gradP[ii+perm[jj]];
    const gi1: Grad = gradP[ii+i1+perm[jj+j1]];
    const gi2: Grad = gradP[ii+1+perm[jj+1]];
    let t0: number = 0.5 - x0*x0-y0*y0;
    if(t0<0) {
        n0 = 0;
    } else {
        t0 *= t0;
        n0 = t0 * t0 * gi0.dot2(x0, y0);
    }
    let t1: number = 0.5 - x1*x1-y1*y1;
    if(t1<0) {
        n1 = 0;
    } else {
        t1 *= t1;
        n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    let t2: number = 0.5 - x2*x2-y2*y2;
    if(t2<0) {
        n2 = 0;
    } else {
        t2 *= t2;
        n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    return 70 * (n0 + n1 + n2);
}