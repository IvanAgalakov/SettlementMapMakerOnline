'use client'

import { useState, MouseEvent } from 'react';
import { Line } from './scripts/Line'
import { Point } from './scripts/Point'

//type Coordinate = [number, number];
//type Line = Coordinate[];

export default function Home() {
  const [lines, setLines] = useState<Line[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    var numX: number = (e.clientX - rect.left);
    var numY: number = e.clientY - rect.top;
    var pointEnd = new Point(numX, numY);
    if (lines.length > 0) {
      setLines([...lines, new Line(lines[lines.length-1].getEnd(), pointEnd)]);
    } else {
      setLines([new Line(new Point(numX, numY), new Point(numX, numY))]);
    }
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    const newLines = [...lines];
    const index = newLines.length - 1;
    const rect = e.currentTarget.getBoundingClientRect();
    newLines[index].setEnd(new Point(e.clientX - rect.left, e.clientY - rect.top));
    setLines(newLines);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24" style={{ height: '100vh' }}>
      <svg
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width="100%"
        height="100%"
        style={{ background: 'lightgrey' }}
      >
        {lines.map((line, i) => (
          <polyline
            key={i}
            points={`${line.getStart().x},${line.getStart().y}` + " " + `${line.getEnd().x},${line.getEnd().y}`}
            fill="none"
            stroke="black"
            strokeWidth="5"
          />
        ))}
      </svg>
    </main>
  );

}
