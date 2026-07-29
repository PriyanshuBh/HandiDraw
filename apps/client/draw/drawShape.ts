/* eslint-disable @typescript-eslint/no-explicit-any */
import { Color, Stroke, Tool } from "../hooks/useDraw";
import { getExistingShapes } from "./http";

export type Shapes = (
    {
        id?: string, type: "RECTANGLE" | "DIAMOND", x: number, y: number, width: number, height: number, color: string, strokeWidth: number
    } | {
        id?: string, type: "CIRCLE", x: number, y: number, radiusX: number, radiusY: number, color: string, strokeWidth: number
    } | {
        id?: string, type: "LINE" | "ARROW", x: number, y: number, points: { endX: number, endY: number }, color: string, strokeWidth: number
    } | {
        id?: string, type: "PENCIL" | "ERASER", points: Array<{x: number, y: number}>, color: string, strokeWidth: number
    } | {
        id?: string, type: "TEXT", x: number, y: number, textContent: string, color: string, strokeWidth: number, fontSize: number
    }
) & { roomId?: string; userId?: string; tempId?: string; fontSize?: number };

export class DrawShapes {
    private socket: WebSocket;
    private roomId: string;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private color: Color;
    private stroke: Stroke;
    private fontSize: number = 24; // Added fontSize property

    private existingShapes: Shapes[] = [];
    public generatedShapes: Shapes[] = [];
    private clicked: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private currentPoints: Array<{x: number, y: number}> = [];

    // --- Camera & Pan/Zoom State ---
    private scale: number = 1;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private isPanning: boolean = false;
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;

    // --- Selection State ---
    public selectedTool: Tool | "" = "";
    private selectedShapes: Shapes[] = []; // Changed to array for multi-select
    private isMovingShape: boolean = false;
    
    private rafId: number | null = null;
    private onZoomChangeCallback: ((zoomPercent: number) => void) | undefined; // Added callback

    constructor(socket: WebSocket, roomId: string, canvas: HTMLCanvasElement, tool: Tool, color: Color, stroke: Stroke | number, onZoomChange?: (zoomPercent: number) => void) {
        this.socket = socket;
        this.roomId = roomId;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.selectedTool = tool;
        this.color = color;
        this.stroke = stroke as Stroke;
        this.onZoomChangeCallback = onZoomChange; // Assign callback
        
        this.loadExistingShapes();
        this.socketHandler();
        this.initializeEventListeners();
        this.handleResize();
        if (this.onZoomChangeCallback) { // Initial notification
            this.onZoomChangeCallback(Math.round(this.scale * 100));
        }
    }

    // --- Event Listeners & State ---
    initializeEventListeners() {
        this.removeEventListeners();
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.removeEventListener('wheel', this.handleWheel.bind(this));
        window.removeEventListener('resize', this.handleResize.bind(this));
        if (this.rafId) cancelAnimationFrame(this.rafId);
    }

    async loadExistingShapes() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.scheduleRedraw();
    }

    socketHandler() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "draw" || message.type === "update") {
                const shape = message.message;
                const index = this.existingShapes.findIndex(s => s.id === shape.id || s.id === shape.tempId);
                if (index !== -1) {
                    this.existingShapes[index] = shape;
                    // If the updated shape is in the current selection, update the reference
                    const selectedIndex = this.selectedShapes.findIndex(s => s.id === shape.id || s.id === shape.tempId);
                    if (selectedIndex !== -1) {
                        this.selectedShapes[selectedIndex] = shape;
                    }
                } else {
                    this.existingShapes.push(shape);
                }
            } else if (message.type === "delete") {
                this.existingShapes = this.existingShapes.filter(s => s.id !== message.shapeId);
                this.selectedShapes = this.selectedShapes.filter(s => s.id !== message.shapeId);
            }
            this.scheduleRedraw();
        };
    }
    
    sendToSocket(shape: any, type: "draw" | "update" = "draw") {
        const message = { type, roomId: this.roomId, message: { ...shape, tempId: shape.id } };
        this.socket.send(JSON.stringify(message));
    }
    
    // --- Mouse Handlers ---
    private getMousePos(e: {clientX: number, clientY: number}) {
        return {
            x: (e.clientX - this.offsetX) / this.scale,
            y: (e.clientY - this.offsetY) / this.scale,
        };
    }

    handleMouseDown(e: MouseEvent) {
        this.clicked = true;
        this.isMovingShape = false;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        const pos = this.getMousePos(e);
        this.startX = pos.x;
        this.startY = pos.y;

        if (this.selectedTool === "HAND" || e.button === 1) {
            this.isPanning = true;
            document.body.style.cursor = "grabbing";
            return;
        }

        if (this.selectedTool === "SELECT") {
            const clickedShape = this.existingShapes.slice().reverse().find(shape => this.isPointInShape(pos.x, pos.y, shape));
            if (clickedShape) {
                if (e.shiftKey) { // Add or remove from selection
                    const index = this.selectedShapes.findIndex(s => s.id === clickedShape.id);
                    if (index > -1) {
                        this.selectedShapes.splice(index, 1); // Deselect if already selected
                    } else {
                        this.selectedShapes.push(clickedShape); // Add to selection
                    }
                } else { // Normal click
                    // If not clicking on a shape that's already part of a multi-selection, start a new selection.
                    if (!this.selectedShapes.some(s => s.id === clickedShape.id)) {
                        this.selectedShapes = [clickedShape];
                    }
                    this.isMovingShape = true;
                }
            } else { // Clicked on empty space
                if (!e.shiftKey) this.selectedShapes = []; // Clear selection if not shift-clicking
            }
        } else if (["PENCIL", "ERASER"].includes(this.selectedTool)) {
            this.currentPoints = [{ x: pos.x, y: pos.y }];
        }
        this.scheduleRedraw();
    }

    handleMouseMove(e: MouseEvent) {
        if (this.isPanning) {
            this.offsetX += e.clientX - this.lastMouseX;
            this.offsetY += e.clientY - this.lastMouseY;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.scheduleRedraw();
            return;
        }

        if (!this.clicked) return;

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        const pos = this.getMousePos(e);

        if (this.isMovingShape && this.selectedShapes.length > 0) {
            const dx = pos.x - this.startX;
            const dy = pos.y - this.startY;
            this.selectedShapes.forEach(shape => this.moveShape(shape, dx, dy));
            this.startX = pos.x;
            this.startY = pos.y;
        } else if (this.selectedTool === "PENCIL") {
            this.currentPoints.push({ x: pos.x, y: pos.y });
        } else if (this.selectedTool === "ERASER") {
            this.currentPoints.push({ x: pos.x, y: pos.y });
            const idsToDelete: string[] = [];
            this.existingShapes = this.existingShapes.filter(shape => {
                if (shape.id && this.doesEraserIntersectShape(this.currentPoints, shape)) {
                    idsToDelete.push(shape.id);
                    this.selectedShapes = this.selectedShapes.filter(s => s.id !== shape.id);
                    return false;
                }
                return true;
            });
            idsToDelete.forEach(id => {
                this.socket.send(JSON.stringify({ type: "delete", roomId: this.roomId, shapeId: id }));
            });
        }
        
        this.scheduleRedraw();
    }

    handleMouseUp(e: MouseEvent) {
        this.isPanning = false;
        document.body.style.cursor = "default";
        
        if (this.isMovingShape && this.selectedShapes.length > 0) {
            this.selectedShapes.forEach(shape => this.sendToSocket(shape, "update"));
        }
        this.isMovingShape = false;

        if (!this.clicked) return;
        this.clicked = false;

        if (["SELECT", "HAND", "ERASER"].includes(this.selectedTool)) {
            this.currentPoints = [];
            this.scheduleRedraw();
            return;
        }
        
        const pos = this.getMousePos(e);
        
        const createShape = (type: Shapes['type'], data: any) => {
            const newShape = { id: `temp-${Date.now()}`, type, ...data, color: this.color, strokeWidth: this.stroke };
            this.existingShapes.push(newShape as Shapes);
            this.sendToSocket(newShape);
        };

        const w = pos.x - this.startX;
        const h = pos.y - this.startY;

        switch (this.selectedTool) {
            case "RECTANGLE": case "DIAMOND":
                if (Math.abs(w) > 2 && Math.abs(h) > 2) createShape(this.selectedTool, { x: this.startX, y: this.startY, width: w, height: h });
                break;
            case "CIRCLE":
                createShape("CIRCLE", { x: this.startX, y: this.startY, radiusX: Math.abs(w), radiusY: Math.abs(h) });
                break;
            case "LINE": case "ARROW":
                createShape(this.selectedTool, { x: this.startX, y: this.startY, points: { endX: pos.x, endY: pos.y } });
                break;
            case "PENCIL":
                if (this.currentPoints.length > 1) createShape("PENCIL", { points: [...this.currentPoints] });
                break;
        }
        this.currentPoints = [];
        this.scheduleRedraw();
    }

    handleWheel(e: WheelEvent) {
        e.preventDefault();
        const scaleAmount = 1.1;
        const oldScale = this.scale;
        this.scale = e.deltaY < 0 ? this.scale * scaleAmount : this.scale / scaleAmount;
        this.offsetX = e.clientX - (e.clientX - this.offsetX) * (this.scale / oldScale);
        this.offsetY = e.clientY - (e.clientY - this.offsetY) * (this.scale / oldScale);
        
        if (this.onZoomChangeCallback) {
            this.onZoomChangeCallback(Math.round(this.scale * 100));
        }
        this.scheduleRedraw();
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.scheduleRedraw();
    }

    // --- Drawing Engine ---
    scheduleRedraw() {
        if (this.rafId) return;
        this.rafId = requestAnimationFrame(() => { this.redrawCanvas(); this.rafId = null; });
    }

    redrawCanvas() {
        if (!this.ctx) return;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        
        this.existingShapes.forEach(shape => this.drawShape(shape));

        if (this.clicked && !["SELECT", "HAND"].includes(this.selectedTool)) {
            const pos = this.getMousePos({ clientX: this.lastMouseX, clientY: this.lastMouseY });
            this.drawPreviewShape(pos.x, pos.y);
        }
        
        if (this.selectedShapes.length > 0) {
            this.selectedShapes.forEach(shape => this.drawSelectionHandles(shape));
        }

        this.ctx.restore();
    }

    drawPreviewShape(x: number, y: number) {
        const w = x - this.startX;
        const h = y - this.startY;
        switch (this.selectedTool) {
            case "RECTANGLE": case "DIAMOND":
                this.drawShape({ type: this.selectedTool, x: this.startX, y: this.startY, width: w, height: h, color: this.color, strokeWidth: this.stroke }); break;
            case "CIRCLE":
                this.drawShape({ type: "CIRCLE", x: this.startX, y: this.startY, radiusX: Math.abs(w), radiusY: Math.abs(h), color: this.color, strokeWidth: this.stroke }); break;
            case "LINE": case "ARROW":
                this.drawShape({ type: this.selectedTool, x: this.startX, y: this.startY, points: { endX: x, endY: y }, color: this.color, strokeWidth: this.stroke }); break;
            case "PENCIL": case "ERASER":
                this.drawShape({ type: this.selectedTool, points: this.currentPoints, color: this.color, strokeWidth: this.stroke }); break;
        }
    }

    drawShape(shape: Shapes) {
        this.ctx.strokeStyle = shape.type === 'ERASER' ? '#262626' : shape.color;
        this.ctx.lineWidth = shape.strokeWidth;
        this.ctx.lineCap = "round"; this.ctx.lineJoin = "round";
        this.ctx.beginPath();
        switch (shape.type) {
            case "RECTANGLE":
                const radius = Math.min(10, Math.abs(shape.width) * 0.2, Math.abs(shape.height) * 0.2);
                this.ctx.roundRect ? this.ctx.roundRect(shape.x, shape.y, shape.width, shape.height, radius) : this.ctx.rect(shape.x, shape.y, shape.width, shape.height);
                break;
            case "DIAMOND":
                this.ctx.moveTo(shape.x + shape.width / 2, shape.y); this.ctx.lineTo(shape.x + shape.width, shape.y + shape.height / 2);
                this.ctx.lineTo(shape.x + shape.width / 2, shape.y + shape.height); this.ctx.lineTo(shape.x, shape.y + shape.height / 2);
                this.ctx.closePath(); break;
            case "CIRCLE": this.ctx.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI); break;
            case "LINE": this.ctx.moveTo(shape.x, shape.y); this.ctx.lineTo(shape.points.endX, shape.points.endY); break;
            case "ARROW": canvas_arrow(this.ctx, shape.x, shape.y, shape.points.endX, shape.points.endY); break;
            case "PENCIL": case "ERASER":
                if (shape.points.length > 0 && shape.points[0]) {
                    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    for (let i = 1; i < shape.points.length; i++) {
                        const pt = shape.points[i];
                        if (pt) this.ctx.lineTo(pt.x, pt.y);
                    }
                } break;
            case "TEXT":
                const fSize = shape.fontSize || 24;
                this.ctx.font = `${fSize}px 'Architects Daughter', cursive, sans-serif`; this.ctx.fillStyle = shape.color; this.ctx.textBaseline = "top";
                shape.textContent.split('\n').forEach((line, i) => { this.ctx.fillText(line, shape.x, shape.y + (i * (fSize + 4))); });
                return;
        }
        this.ctx.stroke();
    }

    drawSelectionHandles(shape: Shapes) {
        this.ctx.strokeStyle = "#8b5cf6"; this.ctx.lineWidth = 2 / this.scale;
        this.ctx.setLineDash([6 / this.scale, 3 / this.scale]);
        this.ctx.beginPath();
        const {minX, minY, maxX, maxY} = this.getShapeBounds(shape);
        const pad = 6 / this.scale;
        this.ctx.strokeRect(minX - pad, minY - pad, (maxX - minX) + 2 * pad, (maxY - minY) + 2 * pad);
        this.ctx.setLineDash([]);
    }

    // --- Public Methods ---
    public setTool(tool: Tool) { this.selectedTool = tool; this.selectedShapes = []; this.scheduleRedraw(); }
    public setColor(color: Color) { this.color = color; }
    public setStroke(stroke: Stroke) { this.stroke = stroke; }
    public setFontSize(size: number) { this.fontSize = size; } // Added setFontSize
    public setZoom(zoomPercent: number) {
        const newScale = zoomPercent / 100; const oldScale = this.scale;
        const centerX = this.canvas.width / 2; const centerY = this.canvas.height / 2;
        this.scale = newScale;
        this.offsetX = centerX - (centerX - this.offsetX) * (this.scale / oldScale);
        this.offsetY = centerY - (centerY - this.offsetY) * (this.scale / oldScale);
        
        if (this.onZoomChangeCallback) {
            this.onZoomChangeCallback(Math.round(this.scale * 100));
        }
        this.scheduleRedraw();
    }
    public addText(content: string, screenX: number, screenY: number) {
        const { x, y } = this.getMousePos({clientX: screenX, clientY: screenY});
        const newShape: Shapes = { id: `temp-${Date.now()}`, type: "TEXT", x, y, textContent: content, color: this.color, strokeWidth: this.stroke, fontSize: this.fontSize };
        this.existingShapes.push(newShape);
        this.sendToSocket(newShape);
        this.scheduleRedraw();
    }

    // --- Helpers ---
    private moveShape(shape: Shapes, dx: number, dy: number) {
        if (shape.type === 'PENCIL' || shape.type === 'ERASER') {
            shape.points = shape.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
        } else if (shape.type === 'LINE' || shape.type === 'ARROW') {
            shape.x += dx; shape.y += dy;
            shape.points.endX += dx; shape.points.endY += dy;
        } else if ('x' in shape && 'y' in shape) {
            shape.x += dx; shape.y += dy;
        }
    }
    private getShapeBounds(shape: Shapes) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        if (shape.type === 'RECTANGLE' || shape.type === 'DIAMOND') {
            minX = Math.min(shape.x, shape.x + shape.width); maxX = Math.max(shape.x, shape.x + shape.width);
            minY = Math.min(shape.y, shape.y + shape.height); maxY = Math.max(shape.y, shape.y + shape.height);
        } else if (shape.type === 'CIRCLE') {
            minX = shape.x - shape.radiusX; maxX = shape.x + shape.radiusX;
            minY = shape.y - shape.radiusY; maxY = shape.y + shape.radiusY;
        } else if (shape.type === 'LINE' || shape.type === 'ARROW') {
            minX = Math.min(shape.x, shape.points.endX); maxX = Math.max(shape.x, shape.points.endX);
            minY = Math.min(shape.y, shape.points.endY); maxY = Math.max(shape.y, shape.points.endY);
        } else if (shape.type === 'PENCIL' || shape.type === 'ERASER') {
            shape.points.forEach(p => {
                minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
                minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
            });
        } else if (shape.type === 'TEXT') {
            minX = shape.x; maxX = shape.x + shape.textContent.length * 12; // Approximation
            minY = shape.y; maxY = shape.y + 24;
        }
        return {minX, minY, maxX, maxY};
    }

    private isPointInShape(x: number, y: number, shape: Shapes): boolean {
        const threshold = (shape.strokeWidth || 2) / 2 / this.scale;
        if (shape.type === 'PENCIL') {
            for (let i = 0; i < shape.points.length - 1; i++) {
                const p1 = shape.points[i];
                const p2 = shape.points[i + 1];
                if (p1 && p2 && distToSegment({ x, y }, p1, p2) < threshold) return true;
            }
            return false;
        }
        if (shape.type === 'LINE' || shape.type === 'ARROW') {
            const p1 = { x: shape.x, y: shape.y };
            const p2 = { x: shape.points.endX, y: shape.points.endY };
            return distToSegment({ x, y }, p1, p2) < threshold;
        }
        const {minX, minY, maxX, maxY} = this.getShapeBounds(shape);
        return x >= minX - threshold && x <= maxX + threshold && y >= minY - threshold && y <= maxY + threshold;
    }

    private doesEraserIntersectShape(eraserPath: Array<{x: number, y: number}>, shape: Shapes): boolean {
        for (const point of eraserPath) {
            if (this.isPointInShape(point.x, point.y, shape)) return true;
        }
        return false;
    }

    // --- AI Generated Shapes Logic ---
    public drawGeneratedShapes(
        ctx: CanvasRenderingContext2D, shapes: Shapes[], roomId: string, userId: string,
        previewWidth: number = 480, previewHeight: number = 320, padding: number = 24
    ) {
        ctx.clearRect(0, 0, previewWidth, previewHeight);
        if (shapes.length === 0) return;

        let combinedBounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
        shapes.forEach(shape => {
            const bounds = this.getShapeBounds(shape);
            combinedBounds.minX = Math.min(combinedBounds.minX, bounds.minX);
            combinedBounds.minY = Math.min(combinedBounds.minY, bounds.minY);
            combinedBounds.maxX = Math.max(combinedBounds.maxX, bounds.maxX);
            combinedBounds.maxY = Math.max(combinedBounds.maxY, bounds.maxY);
        });

        const bboxWidth = combinedBounds.maxX - combinedBounds.minX;
        const bboxHeight = combinedBounds.maxY - combinedBounds.minY;
        const scale = Math.min((previewWidth - 2 * padding) / (bboxWidth || 1), (previewHeight - 2 * padding) / (bboxHeight || 1), 1 );
        const offsetX = (previewWidth - bboxWidth * scale) / 2 - combinedBounds.minX * scale;
        const offsetY = (previewHeight - bboxHeight * scale) / 2 - combinedBounds.minY * scale;

        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        
        const originalCtx = this.ctx;
        this.ctx = ctx; // Temporarily swap context to use main drawShape method
        shapes.forEach(shape => this.drawShape({ ...shape, strokeWidth: shape.strokeWidth || 2 }));
        this.ctx = originalCtx; // Restore original context

        ctx.restore();
        this.generatedShapes = shapes.map(shape => ({ ...shape, roomId, userId })) as Shapes[];
    }

    public pushToExistingShapes(userId: string) {
        if (this.generatedShapes.length === 0) return;

        let existingBounds = { maxX: -Infinity };
        this.existingShapes.forEach(shape => {
            const bounds = this.getShapeBounds(shape);
            if (isFinite(bounds.maxX)) existingBounds.maxX = Math.max(existingBounds.maxX, bounds.maxX);
        });

        let generatedBounds = { minX: Infinity };
        this.generatedShapes.forEach(shape => {
            const bounds = this.getShapeBounds(shape);
            if (isFinite(bounds.minX)) generatedBounds.minX = Math.min(generatedBounds.minX, bounds.minX);
        });

        const GAP = 40 / this.scale;
        let finalOffsetX = 0;
        if (this.existingShapes.length > 0 && isFinite(existingBounds.maxX) && isFinite(generatedBounds.minX)) {
            finalOffsetX = (existingBounds.maxX - generatedBounds.minX) + GAP;
        }

        this.generatedShapes.forEach(shape => {
            const newShape = { ...shape, id: `temp-${Date.now()}-${Math.random()}`, strokeWidth: shape.strokeWidth || this.stroke };
            this.moveShape(newShape, finalOffsetX, 0);
            this.existingShapes.push(newShape);
            this.sendToSocket(newShape);
        });

        this.generatedShapes = [];
        this.scheduleRedraw();
    }
}

function canvas_arrow(context: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number) {
    const headlen = 10; const dx = tox - fromx; const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy); context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function distToSegment(p: {x: number, y: number}, v: {x: number, y: number}, w: {x: number, y: number}) {
    const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
    if (l2 === 0) return Math.sqrt((p.x - v.x)**2 + (p.y - v.y)**2);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = v.x + t * (w.x - v.x);
    const projY = v.y + t * (w.y - v.y);
    return Math.sqrt((p.x - projX)**2 + (p.y - projY)**2);
}
