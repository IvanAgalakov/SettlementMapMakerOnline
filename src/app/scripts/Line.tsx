import { Point } from './Point'

export class Line {
    private start : Point = Point.zero;
    private end : Point = Point.zero;

    constructor(start: Point, end: Point) {
        this.end = end;
        this.start = start;
    }

    public getRise() {
        return this.end.y - this.start.y;
    }

    public getRun() {
        return this.end.x - this.start.x;
    }

    public getLength() {
        return this.start.getDistanceToPoint(this.end);
    }

    public getSlope() {
        if (this.getRun() != 0) {
            return this.getRise()/this.getRun();
        } else {
            return null;
        }
    }

    public getEnd() {
        return this.end;
    }

    public getStart() {
        return this.start;
    }

    public setStart(p : Point) {
        this.start = p;
    }

    public setEnd(p : Point) {
        this.end = p;
    }

    public isPointOnLine(p:Point) {
        return Math.abs(p.getDistanceToPoint(this.start) + p.getDistanceToPoint(this.end) - this.getLength()) < 0.0001;
    }
}