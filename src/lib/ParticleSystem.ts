import { Vector2 } from './Vector2';
import { Particle } from './Particle';
import { phyllotaxis } from './Phyllotaxis';

export class ParticleSystem {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mouse: Vector2 = new Vector2(0, 0); // Initialize with default values
    private particles: Particle[] = []; // Initialize as empty array
    private animationId: number | null = null;
    private particleCount: number = 300;

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
        // Adjust particle count based on screen size
        const area = this.canvas.width * this.canvas.height;
        const baseArea = window.innerWidth * window.innerHeight; // Reference resolution
        this.particleCount = Math.floor((area / baseArea) * 300);
        this.particleCount = Math.max(100, Math.min(500, this.particleCount)); // Clamp between 100-500

        const targets: Vector2[] = phyllotaxis(
            this.canvas.width, 
            this.canvas.height, 
            this.particleCount
        );
        this.particles = targets.map((target: Vector2) => new Particle(target));
    }

    private handleResize = () => {
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;
        
        this.setupCanvas();
        
        // Scale existing particles to new screen size
        const scaleX = this.canvas.width / oldWidth;
        const scaleY = this.canvas.height / oldHeight;
        
        this.particles.forEach((particle: Particle) => {
            particle.position.x *= scaleX;
            particle.position.y *= scaleY;
            particle.target.x *= scaleX;
            particle.target.y *= scaleY;
        });

        // Update mouse position proportionally
        this.mouse.x *= scaleX;
        this.mouse.y *= scaleY;

        // Recreate particles if screen size changed significantly
        const sizeChangeThreshold = 0.3; // 30% change
        if (Math.abs(scaleX - 1) > sizeChangeThreshold || Math.abs(scaleY - 1) > sizeChangeThreshold) {
            this.createParticles();
        }
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Add touch support for mobile
        this.canvas.addEventListener('touchmove', (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.mouse.x = touch.clientX;
                this.mouse.y = touch.clientY;
            }
        });

        // Debounced resize handler
        let resizeTimeout: number;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(this.handleResize, 100);
        });
    }

    start() {
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }


    private lastTime: number = 0; // Add this

    private animate = (currentTime: number) => {

        const deltaTime = this.lastTime === 0 ? 0 : (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (deltaTime > 0.1) {
            this.animationId = requestAnimationFrame(this.animate);
            return;
        }

        // Clear with trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update particles
        this.particles.forEach((p: Particle) => p.update(this.mouse, this.particles, deltaTime));

        // Draw particles
        this.ctx.fillStyle = 'white';
        this.particles.forEach((p: Particle) => {
            this.ctx.beginPath();
            this.ctx.arc(p.position.x, p.position.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw mouse
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.animationId = requestAnimationFrame(this.animate);
    }
}