import { particleSystem } from '../main';
import { mix } from './Colors';
import { Vector2 } from './Vector2';

export class Particle {
    target: Vector2;
    position: Vector2;
    velocity: Vector2;
    maxForce: number;
    springForce: number;
    damping: number;
    screenCenter: Vector2;
    rotation: number;
    scaleMultiplier: number;
    currentShape: string;

    ogcolor: string = "#ffffff";
    color: string = "#ffffff";

    constructor(target: Vector2, screenCenter: Vector2) {
        this.target = target;
        this.position =  new Vector2((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50).add(target.copy().scale(screenCenter, 1.0 + Math.random() * 0.1));
        this.velocity = new Vector2(0, 0);
        this.maxForce = 0.12;
        this.springForce = 0.0018;
        this.damping = 0.9;
        this.screenCenter = screenCenter;
        this.rotation = 0;
        this.scaleMultiplier = 0;
        this.currentShape = 'base';
    }

    update(mouse: Vector2, particles: Particle[]): void {
        const toTarget: Vector2 = this.target.sub(this.position);
        const distance: number = toTarget.length();
        
        if (distance > 0.5) {
            const spring: Vector2 = toTarget.mul(this.springForce * distance);
            this.velocity = this.velocity.add(spring);
        }

        const mouseDistance: number = this.position.distance(mouse);
        if (mouseDistance < this.screenCenter.x / 2) {
            const distFactor = Math.pow((mouseDistance / 1000), 10);
            const away: Vector2 = this.position.sub(mouse).mul(distFactor).normalize();
            if (mouseDistance < 50) {
                this.rotation += 0.25;
            }
            this.velocity = this.velocity.add(away.mul(0.5));
        }

        if(particleSystem.halo) {
            this.color = mix( "#ffffff", this.ogcolor, Math.max(0.4, Math.min(mouseDistance / 700.0, 1.0)) * 1.5);
        } else {
            this.color = this.ogcolor;
        }

        for (const other of particles) {
            if (other === this) continue;
            const dist: number = this.position.distance(other.position);
            if (dist < 25 && dist > 0) {
                const away: Vector2 = this.position.sub(other.position).normalize();
                this.velocity = this.velocity.add(away.mul(0.3));
            }
        }

        const newRotation = this.rotation - 0.02;
        this.rotation = Math.max(0, newRotation);
        this.velocity = this.velocity.mul(this.damping);
        this.position = this.position.add(this.velocity);
    }
}