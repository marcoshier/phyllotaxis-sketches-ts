export class Vector2 {
    x: number;
    y: number;
    
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    
    add(v: Vector2): Vector2 { 
        return new Vector2(this.x + v.x, this.y + v.y); 
    }
    
    sub(v: Vector2): Vector2 { 
        return new Vector2(this.x - v.x, this.y - v.y); 
    }
    
    mul(s: number): Vector2 { 
        return new Vector2(this.x * s, this.y * s); 
    }
    
    length(): number { 
        return Math.sqrt(this.x * this.x + this.y * this.y); 
    }
    
    normalize(): Vector2 { 
        const len = this.length();
        return len > 0 ? new Vector2(this.x / len, this.y / len) : new Vector2(0, 0);
    }
    
    distance(v: Vector2): number { 
        return this.sub(v).length(); 
    }

    copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    perpCCW(): Vector2 {
        return new Vector2(-this.y, this.x);
    }
    
    perpCW(): Vector2 {
        return new Vector2(this.y, -this.x);
    }

    scale(origin: Vector2, amount: number): Vector2 {
        const translated = this.sub(origin);
        const scaled = translated.mul(amount);
        return scaled.add(origin);
    }
}
