import { Line } from './Line'
import { Point } from './Point'

export class Shape {

    protected points: Point[];
    private center: Point = Point.zero;
    private topRight: Point = Point.zero;
    private bottomLeft: Point = Point.zero;

    private width: number = 0;
    private height: number = 0;


    constructor(points: Point[]) {
        this.points = points;

        this.CalculateCenter();
    }

    public CalculateCenter() {
        var averageX = 0;
        var averageY = 0;

        var bigX: number | null = null;
        var bigY: number | null = null;
        var smallX: number | null = null;
        var smallY: number | null = null;

        for (let i = 0; i < this.points.length; i++) {
            averageX += this.points[i].x;
            averageY += this.points[i].y;

            if (i == 0) {
                bigX = this.points[i].x;
                bigY = this.points[i].y;
                smallX = this.points[i].x;
                smallY = this.points[i].y;
            }

            if (bigX != null && this.points[i].x > bigX) {
                bigX = this.points[i].x;
            }
            if (bigY != null && this.points[i].y > bigY) {
                bigY = this.points[i].y;
            }

            if (smallX != null && this.points[i].x < smallX) {
                smallX = this.points[i].x;
            }
            if (smallY != null && this.points[i].y < smallY) {
                smallY = this.points[i].y;
            }
        }

        this.center = new Point(averageX / (this.points.length), averageY / (this.points.length));
        if (bigX != null && bigY != null && smallX != null && smallY != null) {
            this.topRight = new Point(bigX, bigY);
            this.bottomLeft = new Point(smallX, smallY);
        } else {
            this.topRight = Point.fromPoint(this.center);
            this.bottomLeft = Point.fromPoint(this.center);
        }

        this.width = Math.abs(this.bottomLeft.x) + Math.abs(this.topRight.x);
        this.height = Math.abs(this.bottomLeft.y) + Math.abs(this.topRight.y);
    }

    public hasSharedPoints(shape: Shape, number: number) {
        var count = 0;
        for (let i = 0; i < shape.getPoints().length; i++) {
            for (let x = 0; x < this.points.length; x++) {
                if (shape.getPoints()[i].equals(this.points[x])) {
                    count++;
                    if (count >= number) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public getPoints() {
        return this.points;
    }

    public getDrawPoints() {
        if (this.points.length == 0) {
            return [];
        }
        return [...this.points, this.points[0]];
    }

    public addPoint(p: Point) {
        this.points.push(p);
        return this;
    }

    public setLast(p: Point) {
        this.points[this.points.length-1] = p;
        return this;
    }

}