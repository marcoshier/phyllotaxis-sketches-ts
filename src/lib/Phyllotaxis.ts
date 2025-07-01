import { Vector2 } from './Vector2';

export function phyllotaxis(width: number, height: number, count: number): Vector2[] {
    const points: Vector2[] = [];
    const goldenAngle: number = Math.PI * (3 - Math.sqrt(5));

    const radius: number = Math.min(width, height) * 0.35;
    const center: Vector2 = new Vector2(width / 2, height / 2);
    
    for (let i = 0; i < count; i++) {
        const angle: number = i * goldenAngle;
        const r: number = Math.sqrt(i / count) * radius;
        const x: number = center.x + Math.cos(angle) * r;
        const y: number = center.y + Math.sin(angle) * r;
        points.push(new Vector2(x, y));
    }
    
    return points;
}