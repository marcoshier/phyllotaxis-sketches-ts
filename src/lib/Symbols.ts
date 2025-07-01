import { Vector2 } from "./Vector2";

/** Strategic Asset Allocation and Risk Management, blue triangle */
export function base(ctx: CanvasRenderingContext2D, center: Vector2, size: number = 10) {
    ctx.fillStyle = 'fuchsia';
    ctx.beginPath();
    ctx.arc(center.x, center.y, size, 0, Math.PI * 2);
    ctx.fill();
}

/** Strategic Asset Allocation and Risk Management, blue triangle */
export function saarm(ctx: CanvasRenderingContext2D, center: Vector2, size: number = 30, rotation: number = 0) {
    const height = (size * Math.sqrt(3)) / 2;
    
    ctx.fillStyle = '#3b82f6';
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.moveTo(0, -height * 2/3);
    ctx.lineTo(-size/2, height * 1/3); 
    ctx.lineTo(0, height * 1/6);
    ctx.lineTo(size/2, height * 1/3); 
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

/** IT Accounting Solution for the Family Wealth, pink line */
export function itasfw(ctx: CanvasRenderingContext2D, center: Vector2, size: number = 30, rotation: number = 0) {
    ctx.fillStyle = '#ec4899';
    
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotation);
    ctx.fillRect(- (size / 2), (size / 2), size, size * 0.14);
    ctx.restore();
}

/** Philanthropic consultancy, rounded lilac triangle */
export function phco(ctx: CanvasRenderingContext2D, center: Vector2, size: number = 20, rotation: number = 0) {
    const height = (size * Math.sqrt(3)) / 2;
    const radius = 4.0;

    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotation);
    
    const top = { x: 0, y: -height * 2/3 };
    const bottomLeft = { x: -size/2, y: height * 1/3 };
    const bottomRight = { x: size/2, y: height * 1/3 };
    
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = '#a855f7';
    ctx.lineJoin = "round";
    ctx.lineWidth = radius * 2;
    
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottomRight.x, bottomRight.y);
    ctx.lineTo(top.x, top.y + height * 0.8);
    ctx.lineTo(bottomLeft.x, bottomLeft.y);
    ctx.closePath();
    
    ctx.stroke();
    ctx.fill();
    
    ctx.restore();
    ctx.lineJoin = "miter";

}

/** Education, blue square */
export function edu(ctx: CanvasRenderingContext2D, center: Vector2, size: number = 30, rotation: number) {
    const half = size / 2;
    
    ctx.fillStyle = '#3b82f6';

    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotation);
    ctx.fillRect(-half, -half, size, size);
    ctx.restore();
}