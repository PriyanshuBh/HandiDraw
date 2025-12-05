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