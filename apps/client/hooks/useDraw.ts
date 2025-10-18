import { useCallback, useState } from "react";

export type Tool =
  | ""
  | "SELECT"
  | "HAND"       // Grab Tool
  | "PENCIL"
  | "RECTANGLE"
  | "DIAMOND"    // New Shape
  | "CIRCLE"
  | "LINE"
  | "ARROW"
  | "TEXT"
  | "ERASER"
  | "AI";

export type Color = string; 
export type Size = 12 | 16 | 20 | 24;
export type Stroke = 1 | 3 | 5;

export const useDraw = () => {
  const [tool, setTool] = useState<Tool>("SELECT");
  const [color, setColor] = useState<Color>("#ffffff");
  const [size, setSize] = useState<Size>(16);
  const [stroke, setStroke] = useState<Stroke>(3);
  const [zoom, setZoom] = useState<number>(100);

  return {
    tool, setTool: useCallback((t: Tool) => setTool(t), []),
    changeTool: useCallback((t: Tool) => setTool(t), []),
    color, setColor: useCallback((c: Color) => setColor(c), []),
    changeColor: useCallback((c: Color) => setColor(c), []),
    size, setSize: useCallback((s: Size) => setSize(s), []),
    changeSize: useCallback((s: Size) => setSize(s), []),
    stroke, setStroke: useCallback((s: Stroke) => setStroke(s), []),
    changeStroke: useCallback((s: Stroke) => setStroke(s), []),
    zoom, setZoom: useCallback((z: number) => setZoom(z), [])
  };
};