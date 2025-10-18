# HandiDraw Feature Roadmap & Improvements

This document outlines high-impact features and technical improvements to transition HandiDraw into a professional-grade collaborative whiteboard tool.

## 1. Real-time Collaboration Enhancements
*   **Collaborative Cursors:** Broadcast and render other users' mouse positions in real-time with name tags. This makes the session feel "alive."
*   **Presence Indicators:** An avatar stack in the header showing all active users in the current room.
*   **"Follow Me" Mode:** Allow users to sync their camera (pan/zoom) to a specific presenter's view.

## 2. Core Drawing Features
*   **Infinite Undo / Redo:** Implement a history stack (local or synced) to allow users to revert mistakes with `Ctrl+Z`.
*   **Snap-to-Grid & Auto-Connect:** Allow lines and arrows to "snap" to the edges of shapes (essential for flowcharts).
*   **Shape Perfecting:** Automatically convert messy hand-drawn circles or squares into clean geometric shapes.
*   **Group / Ungroup:** Allow users to group multiple shapes together to move or resize them as a single unit.

## 3. Productivity & Export
*   **SVG/PNG Export:** Allow users to download their canvas. SVG is preferred for maintaining sharpness.
*   **Keyboard Shortcuts:** Full support for shortcuts (e.g., `V` for Select, `R` for Rectangle, `T` for Text, `Space` for Hand).
*   **Rich Text Support:** Support for different fonts, bold/italic, and text alignment within the Text tool.

## 4. Technical Improvements
*   **Layered Rendering:** Use a double-canvas system.
    *   *Static Layer:* Renders saved shapes from the database (only redraws on change).
    *   *Active Layer:* Renders preview shapes and selection handles (redraws on mouse move).
    *   *Result:* Zero lag even with thousands of shapes.
*   **Throttling/Debouncing:** Throttle cursor and movement updates over WebSockets to reduce server load.
*   **Theme Persistence:** Implement the Light/Dark mode toggle and save the user's preference in the database.

## 5. AI Integration
*   **Sketch to Image:** Use AI to turn a simple wireframe/sketch into a realistic UI mockup or image.
*   **Natural Language Commands:** "Draw a flowchart for a login system" – have the AI generate the entire diagram.
