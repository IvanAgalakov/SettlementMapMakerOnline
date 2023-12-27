'use client'

import { useState, MouseEvent } from 'react';
import { Shape } from './scripts/Shape'
import { Line } from './scripts/Line'
import { Point } from './scripts/Point'

//type Coordinate = [number, number];
//type Line = Coordinate[];

export default function Home() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  //const [lines, setLines] = useState<Line[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const [panStart, setPanStart] = useState<Point>(new Point(0,0));
  const [pan, setPan] = useState<Point>(new Point(0,0));
  const [isPanning, setIsPanning] = useState(false);

  const updateCurrentShape = (s: Shape) => {
    for (let i = 0; i < shapes.length; i++) {
      if (shapes[i] === currentShape) {
        shapes[i] = s;
        break;
      }
    }
    setCurrentShape(new Shape(s.getPoints()));
  }

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    var numX: number = (e.clientX - rect.left);
    var numY: number = (e.clientY - rect.top);
    var pointEnd = new Point(numX, numY);

    if (e.button === 0) {
      if (currentShape != null) {
        setIsDrawing(true);
        updateCurrentShape(currentShape.addPoint(new Point(pointEnd.x - pan.x, pointEnd.y - pan.y)));
      }
    } else if (e.button === 1) {
      setPanStart(pointEnd);
      setIsPanning(true);
    }
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    
    const rect = e.currentTarget.getBoundingClientRect();
    const updatedPoint = new Point(e.clientX - rect.left, e.clientY - rect.top);
    if (isDrawing) {
      if (!currentShape) return;  
      updateCurrentShape(currentShape.setLast(new Point(updatedPoint.x - pan.x, updatedPoint.y - pan.y)));
    }
    if (isPanning) {
      var deltaX = updatedPoint.x - panStart.x;
      var deltaY = updatedPoint.y - panStart.y;

      console.log(deltaX, ",", deltaY);

      setPan(new Point(pan.x + deltaX, pan.y + deltaY));
      setPanStart(new Point(updatedPoint.x, updatedPoint.y));
    }
  };
  
  

  const handleMouseUp = (e: MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) {
      setIsDrawing(false);
    } else if (e.button === 1) {
      setPanStart(new Point(0,0));
      setIsPanning(false);
    }
  };

  const handleNewShape = () => {
    var shape = new Shape([]);
    setShapes([...shapes, shape]);
    setCurrentShape(shape);
  }

  const handleShape = (index: number) => {
    setCurrentShape(shapes[index]);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24" style={{ height: '100vh' }}>
      <svg
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, background: 'lightgrey', zIndex: 1 }}
      >

        {shapes.map((shape, i) => (
          <polyline
            key={i}
            points={shape.getDrawPoints().map(point => `${point.x+pan.x},${point.y+pan.y}`).join(' ')}
            fill="none"
            stroke="black"
            strokeWidth="5"
          />
        ))}
      </svg>

      <div className="absolute top-4 left-4 z-2" style={{ zIndex: 2 }}>
        <button onClick={handleNewShape} className="bg-blue-500 text-white px-4 py-2">
          New Shape
        </button>

        <div>
          <h4>Shapes:</h4>
          <ul>
            {shapes.map((shape, index) => (
              <button
                key={index}
                onClick={() => handleShape(index)}
                className="bg-gray-300 text-gray-700 px-2 py-1 m-1 rounded"
              >
                {`Shape ${index + 1}`}
              </button>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );


}
