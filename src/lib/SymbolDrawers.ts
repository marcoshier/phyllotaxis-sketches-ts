import type { Particle } from "./Particle";
import { simplex2 } from "./Simplex";
import { base, edu, itasfw, phco, saarm } from "./Symbols";
import { Vector2 } from "./Vector2";

export function drawBase(ctx: CanvasRenderingContext2D, p: Particle) {
    p.ogcolor = '#EF2B7C';
    base(ctx, p.position, 10 * p.scaleMultiplier, p.color)
}

export function drawSaarm(ctx: CanvasRenderingContext2D, p: Particle, animationId: number | null) {
    const t = (animationId) ? (animationId * 0.002) : 0
    const rotation = simplex2(p.position.x * 0.005 + t, p.position.y * 0.005 - t)
    p.ogcolor = '#3b82f6';
    saarm(ctx, p.position, 30 * p.scaleMultiplier, rotation + p.rotation, p.color)
}

export function drawItasfw(ctx: CanvasRenderingContext2D, p: Particle, animationId: number | null) {
    const t = (animationId) ? (animationId * 0.0001) : 0
    const screenCenter = new Vector2(window.innerWidth / 2.0, window.innerHeight / 2.0);
    const toCenter = screenCenter.sub(p.position);
    const perpToCenter = toCenter.perpCW();
    
    const n = simplex2(p.position.x * 0.02 + t, p.position.y * 0.02 - t) * 1.0 + 1.0;
    const rotation = Math.atan2(perpToCenter.y, perpToCenter.x) + (3.14 / 4 + n);

    p.ogcolor = '#ec4899';
    itasfw(ctx, p.position, 25 * p.scaleMultiplier, rotation + p.rotation, p.color)
}

export function drawPhco(ctx: CanvasRenderingContext2D, p: Particle, animationId: number | null) {
    const t = (animationId) ? (animationId * 0.002) : 0
    const rotation = simplex2(p.position.x * 0.005 + t, p.position.y * 0.005 - t)

    p.ogcolor = '#a855f7';
    phco(ctx, p.position, 20 * p.scaleMultiplier, rotation + p.rotation, p.color) 
}

export function drawEdu(ctx: CanvasRenderingContext2D, p: Particle, animationId: number | null) {
    const t = (animationId) ? (animationId * 0.002) : 0
    const rotation = simplex2(p.position.x * 0.005 + t, p.position.y * 0.005 - t)

    p.ogcolor = '#3b82f6';
    edu(ctx, p.position, 20 * p.scaleMultiplier, rotation + p.rotation, p.color)
}