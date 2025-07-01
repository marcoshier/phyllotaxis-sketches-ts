import { Vector2 } from './Vector2';

export class Particle {
    target: Vector2;
    position: Vector2;
    velocity: Vector2;
    maxForce: number;
    springForce: number;
    damping: number;

    constructor(target: Vector2) {
        this.target = target;
        this.position = new Vector2(
            target.x + (Math.random() - 0.5) * 400,
            target.y + (Math.random() - 0.5) * 400
        );
        this.velocity = new Vector2(0, 0);
        this.maxForce = 0.12;
        this.springForce = 0.0008;
        this.damping = 0.98;
    }

    update(mouse: Vector2, particles: Particle[], dt: number): void {
        const toTarget: Vector2 = this.target.sub(this.position);
        const distance: number = toTarget.length();
        
        if (distance > 0.5) {
            const spring: Vector2 = toTarget.mul(this.springForce * distance);
            this.velocity = this.velocity.add(spring);
        }

        const mouseDistance: number = this.position.distance(mouse);
        if (mouseDistance < 200) {
            const away: Vector2 = this.position.sub(mouse).normalize();
            this.velocity = this.velocity.add(away.mul(0.5));
        }

        for (const other of particles) {
            if (other === this) continue;
            const dist: number = this.position.distance(other.position);
            if (dist < 25 && dist > 0) {
                const away: Vector2 = this.position.sub(other.position).normalize();
                this.velocity = this.velocity.add(away.mul(0.3));
            }
        }

        this.velocity = this.velocity.mul(this.damping);
        this.position = this.position.add(this.velocity);
    }
}