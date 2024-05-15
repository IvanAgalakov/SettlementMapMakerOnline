import { Line } from './Line'
import { Point } from './Point'

export class Utils {

    public static normalPointToPoint(p : Point, rise : number, run : number, deviate : number) {
        var hypo =  Math.sqrt((rise*rise)+(run*run));
        return Utils.getPointAlongLine(p,-run,rise,deviate);
    } 

    public static getPointAlongLine(start: Point, rise: number, run: number, deviate: number) {
        var runSq = Math.pow(run, 2);
        var riseSq = Math.pow(rise, 2);
        var formula = (Math.sign(deviate)*Math.sqrt(Math.pow(deviate,2)/(runSq+riseSq)));

        return new Point(start.x + run * formula, start.y + rise * formula);
    }
    
}