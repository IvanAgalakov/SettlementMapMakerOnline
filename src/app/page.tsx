'use client'

//import * as htmlToImage from 'html-to-image';
//import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

import React, { MouseEvent, useRef, useState, WheelEvent, useEffect } from 'react';
//import { useState, MouseEvent, useRef } from 'react';
import { Shape } from './scripts/Shape'
import { Line } from './scripts/Line'
import { Point } from './scripts/Point'

export default function Home() {
   const [shapes, setShapes] = useState<Shape[]>([]);

   const [isDrawing, setIsDrawing] = useState(false);
   const [currentShape, setCurrentShape] = useState<number | null>(null);

   const [panStart, setPanStart] = useState<Point>(new Point(0,0));
   const [pan, setPan] = useState<Point>(new Point(0,0));
   const [isPanning, setIsPanning] = useState(false);


   const [zoom, setZoom] = useState(1); // Initial zoom factor

  const handleScroll = (e: WheelEvent) => {
    if (e.deltaY > 0) {
      setZoom(Math.max(zoom - 0.0001*e.deltaY, 0.1));
    } else {
      setZoom(zoom + 0.0001*-e.deltaY);
    }
  };

  const updateCurrentShape = (s: Shape) => {
    for (let i = 0; i < shapes.length; i++) {
      if (i == currentShape) {
        console.log("updated");
        s.CalculateCenter();
        s.calculateVoronoi();
        console.log(s);
        shapes[i] = s;
        setCurrentShape(i);
        break;
      }
    }
  }

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    var numX: number = (e.clientX - rect.left);
    var numY: number = (e.clientY - rect.top);
    var pointEnd = new Point(numX, numY);

    if (e.button === 0) {
      if (currentShape != null) {
        setIsDrawing(true);
        console.log("new point");
        updateCurrentShape(shapes[currentShape].addPoint(new Point(pointEnd.x/zoom-pan.x, pointEnd.y/zoom-pan.y)));
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
      updateCurrentShape(shapes[currentShape].setLast(new Point(updatedPoint.x/zoom-pan.x, updatedPoint.y/zoom-pan.y)));
    }
    if (isPanning) {
      var deltaX = updatedPoint.x - panStart.x;
      var deltaY = updatedPoint.y - panStart.y;



      setPan(new Point(pan.x + deltaX/zoom, pan.y + deltaY/zoom));
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
    if (currentShape != null) {
      setCurrentShape(currentShape+1);
    } else {
      setCurrentShape(0);
    }
  }

  const handleShape = (index: number) => {
    setCurrentShape(index);
  };

  const svgRef = useRef<SVGSVGElement | null>(null); // Reference to the SVG element

  const exportCanvas = () => {
    if (svgRef.current) {
      const svgString = new XMLSerializer().serializeToString(svgRef.current);
      const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
  
      console.log("GO")
      var link = document.createElement('a');
      link.download = 'canvas.svg';
      link.href = dataUrl;
      link.click();
    }
  };
  

  return (
    <main className="flex flex-col items-center justify-between p-24" style={{ height: '100vh' }}>
      <svg
        ref={svgRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={(e: WheelEvent<SVGSVGElement>) => handleScroll(e)}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, background: 'lightgrey', zIndex: 1 }}
      >

        {shapes.map((shape, i) => (
          <polyline
            key={i}
            points={shape.getContainedDrawPoints().map(point => `${(point.x+pan.x)*zoom},${(point.y+pan.y)*zoom}`).join(' ')}
            fill="none"
            stroke="black"
            strokeWidth={5*zoom}
          />
        ))}
      </svg>

      <div className="absolute top-4 left-4 z-2" style={{ zIndex: 2 }}>
        <button onClick={handleNewShape} className="bg-red-500 text-white px-4 py-2">
          New Shape
        </button>

        <button onClick={exportCanvas} className="bg-green-500 text-white px-4 py-2 ml-4">
          Export Canvas
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
