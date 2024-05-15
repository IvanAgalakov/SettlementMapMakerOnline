import { Point } from './Point'

export class Line {
    private start : Point = Point.zero;
    private end : Point = Point.zero;
    private nextLine : Line | null = null;
    private prevLine : Line | null = null;

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
        return Math.abs(p.getDistanceToPoint(this.start) + p.getDistanceToPoint(this.end) - this.getLength()) < 0.001;
    }

    public getIntersection(line:Line) {
        if (this == line) {
            return null;
        }
        var a1 = this.end.y - this.start.y;
        var b1 = this.start.x - this.end.x;
        var c1 = a1 * this.start.x + b1 * this.start.y;
 
        var a2 = line.end.y - line.start.y;
        var b2 = line.start.x - line.end.x;
        var c2 = a2 * line.start.x + b2 * line.start.y;
 
        var delta = a1 * b2 - a2 * b1;

        var inter : null | Point = new Point((b2 * c1 - b1 * c2) / delta, (a1 * c2 - a2 * c1) / delta);
        
        if (inter.getDistanceToPoint(line.getStart()) == 0 || inter.getDistanceToPoint(line.getEnd()) == 0) {
            inter = null;
        }
        else if (!this.isPointOnLine(inter)) {
            inter = null;
        }
        
        
        return inter;
    }

    public getIntersections(lines : Line[]) : [Line[], Line[], Point[]]{
        var intersections : [Line[], Line[], Point[]] = [[],[],[]];
        for (let l of lines) {
            var inter = this.getIntersection(l);
            if (inter != null) {
                intersections[0].push(this);
                intersections[1].push(l);
                intersections[2].push(inter);
            }
        }
        return intersections;
    }

    public setNextLine(line:Line) {
        this.nextLine = line;
    }

    public getNextLine() {
        return this.nextLine;
    }

    public setPrevLine(line:Line) {
        this.prevLine = line;
    }

    public getPrevLine() {
        return this.prevLine;
    }
}