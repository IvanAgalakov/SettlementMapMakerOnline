export class Point {
    public x: number;
    public y: number;

    public static readonly zero = new Point(0,0);

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    public static fromPoint(p : Point): Point {
        const point = new Point(p.x, p.y);
        return point;
    }

    public add(p:Point) {
        this.x += p.x;
        this.y += p.y;
    }

    public getDistanceToPoint(p : Point) : number {
        return Math.sqrt(Math.pow((this.x - p.x), 2) + Math.pow((this.y - p.y), 2));
    }

    public equals(p:Point) : boolean {
        if (p.x == this.x && p.y == this.y) {
            return true;
        }
        return false;
    }
}