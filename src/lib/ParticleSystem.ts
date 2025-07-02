import { Vector2 } from './Vector2';
import { Particle } from './Particle';
import { phyllotaxis } from './Phyllotaxis';
import { drawBase, drawEdu, drawItasfw, drawPhco, drawSaarm } from './SymbolDrawers';
import { fadeIn } from './Transition';


export class ParticleSystem {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mouse: Vector2 = new Vector2(0, 0);
    private animationId: number | null = null;
    private particleCount: number = 300;

    interactive = true;
    halo = true;

    particles: Particle[] = [];

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found`);
        }
        
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D rendering context');
        }
        this.ctx = context;

        this.initialize();
        this.setupEventListeners();
    }

    toggleInteractive() {
        this.interactive = !this.interactive;
    }

    toggleHalo() {
        this.halo = !this.halo;
    }

    private initialize() {
        this.setupCanvas();
        this.mouse = new Vector2(this.canvas.width / 2, this.canvas.height / 2);
        this.createParticles();
    }

    private setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private createParticles() {
        
        const area = this.canvas.width * this.canvas.height;
        const baseArea = window.innerWidth * window.innerHeight;
        this.particleCount = Math.floor((area / baseArea) * 300);
        this.particleCount = Math.max(100, Math.min(500, this.particleCount));

        const targets: Vector2[] = phyllotaxis(
            this.canvas.width, 
            this.canvas.height, 
            this.particleCount
        );
        this.particles = targets.map((target: Vector2) => new Particle(target, new Vector2(this.canvas.width / 2, this.canvas.height / 2)));
    }

    private handleResize = () => {
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;
        
        this.setupCanvas();
        
        const scaleX = this.canvas.width / oldWidth;
        const scaleY = this.canvas.height / oldHeight;
        
        this.particles.forEach((particle: Particle) => {
            particle.position.x *= scaleX;
            particle.position.y *= scaleY;
            particle.target.x *= scaleX;
            particle.target.y *= scaleY;
        });

        this.mouse.x *= scaleX;
        this.mouse.y *= scaleY;

        const sizeChangeThreshold = 0.3;
        if (Math.abs(scaleX - 1) > sizeChangeThreshold || Math.abs(scaleY - 1) > sizeChangeThreshold) {
            this.createParticles();
        }
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('touchmove', (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.mouse.x = touch.clientX;
                this.mouse.y = touch.clientY;
            }
        });

        let resizeTimeout: number;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(this.handleResize, 100);
        });
    }

    start() {
        fadeIn();
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    private fps = 60;
    private msPerFrame = 1000 / this.fps;
    private msPrev = window.performance.now()

    private animate = () => {
        const msNow = window.performance.now()
        const msPassed = msNow - this.msPrev
        
        if (msPassed < this.msPerFrame) {
            this.animationId = requestAnimationFrame(this.animate);
            return;
        }

        const excessTime = msPassed % this.msPerFrame
        this.msPrev = msNow - excessTime

        this.ctx.fillStyle = '#060b2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.interactive) {
            this.particles.forEach((p: Particle) => p.update(this.mouse, this.particles));
        } else {
            this.particles.forEach((p: Particle) => p.update(new Vector2(-9999, -9999), this.particles));
        }

        this.particles.forEach((p: Particle) => {
            switch(p.currentShape) {
                case 'base':
                    drawBase(this.ctx, p)
                    break
                case 'saarm':
                    drawSaarm(this.ctx, p, msNow / 1000.0)
                    break
                case 'itasfw':
                    drawItasfw(this.ctx, p, msNow / 1000.0)
                    break
                case 'phco':
                    drawPhco(this.ctx, p, msNow / 1000.0)
                    break
                case 'edu':
                    drawEdu(this.ctx, p, msNow / 1000.0)
                    break
                default:
                    drawBase(this.ctx, p)
            }
        });

        this.animationId = requestAnimationFrame(this.animate);
    }
}