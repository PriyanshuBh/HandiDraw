import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "@repo/backend-common/config"
import { JWT_SECRET } from "@repo/backend-common/config";

// import { updateData } from "./queues/shapeQueue.js";
import { deleteShapeFromDatabase, insertIntoDB, updateShapeInDatabase } from "./lib/utils.js"; // Added updateShapeInDatabase
// import { v4 as uuidv4 } from 'uuid';
// const { uuidv4} = require('uuid');
import express, { Express, Request, Response } from "express";
import expressWs from 'express-ws'; // Converted to import

const app = express() as Express & {
  ws: (route: string, callback: (ws: WebSocket, req: Request) => void) => void;
}; // Type assertion for app

// Initialize express-ws
expressWs(app);
interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

const checkUser = (token: string | undefined): string | null => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (typeof decoded === "string" || !decoded.userId) return null;
    return decoded.userId;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

app.ws("/", function (ws: WebSocket, request: any) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";

  if (!token) {
    console.error("No token found in cookies");
    ws.close();
    return;
  }

  const userId = checkUser(token);

  if (!userId) {
    console.error("invalid token")
    ws.close();
    return;
  }

  const existingUserIndex = users.findIndex(u => u.userId === userId);
  if (existingUserIndex >= 0) {
    users[existingUserIndex]!.ws = ws;
  } else {
    users.push({ userId, rooms: [], ws });
  }

  ws.on("message", async function message(data) {
    const messageData = typeof data === "string" ? data : data.toString();
    const parsedData = JSON.parse(messageData);

    if (parsedData.type === "join_room") {
      const user = users.find((u) => u.ws === ws);
      if (!user) return;
      const roomId = (parsedData.roomId)
      user.rooms.push(roomId);
    }

    if(parsedData.type === "update"){
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      message.roomId = roomId;
      message.userId = userId; // Ensure userId is passed for database update
      try {
        if (!message.id) {
          console.error("Shape ID is required for edit operations");
          ws.send(JSON.stringify({
            type: "error",
            message: "Shape ID is required for edit operations"
          }));
          return;
        }

        await updateShapeInDatabase(message); // Persist update to DB

        const usersInRoom = users.filter(user => 
          user.rooms.includes(roomId.toString()) && user.userId !== userId
        );

        usersInRoom.forEach(user => {
          const broadcastMessage = {
            type: "update",
            message: {
              ...message,
              userId
            },
            roomId
          };

          user.ws.send(JSON.stringify(broadcastMessage));
        });

      } catch (error) {
        console.error("Error processing edit operation:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Failed to process edit operation"
        }));
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((u) => u.ws === ws);
      if (!user) return;
      user.rooms = user.rooms.filter((roomId) => roomId !== parsedData.roomId);
    }

    if (parsedData.type === "draw") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      const { v4  } = await import('uuid');
      const shapeId = v4()
      
      await insertIntoDB(roomId, message, userId, shapeId); // Persist new shape to DB

      const usersInRoom = users.filter(user => 
        user.rooms.includes(roomId.toString()) && user.userId !== userId
      );

      usersInRoom.forEach(user => {
        const broadcastMessage = {
          type: "draw",
          message: {
            ...message,
            id: shapeId, // Assign new shapeId
            tempId: message.tempId 
          },
          roomId
        };
        user.ws.send(JSON.stringify(broadcastMessage));
      });
      
      const originalUser = users.find(user => user.userId === userId);
      if (originalUser) {
        const responseMessage = {
          type: "draw",
          message: {
            ...message,
            id: shapeId, // Assign new shapeId
            tempId: message.tempId
          },
          roomId
        };
        originalUser.ws.send(JSON.stringify(responseMessage));
      }
    }

    if (parsedData.type === "delete") {
      await deleteShapeFromDatabase(parsedData.shapeId);

      const usersInRoom = users.filter(user => 
        user.rooms.includes(parsedData.roomId.toString()) && user.userId !== userId
      );

      usersInRoom.forEach(user => {
        const broadcastMessage = {
          type: "delete",
          shapeId: parsedData.shapeId, // Changed to shapeId directly as per client expectation
          roomId: parsedData.roomId
        };
        user.ws.send(JSON.stringify(broadcastMessage));
      });

      // Also broadcast to the original user for confirmation/state consistency
      const originalUser = users.find(user => user.userId === userId);
      if (originalUser) {
        const responseMessage = {
          type: "delete",
          shapeId: parsedData.shapeId,
          roomId: parsedData.roomId
        };
        originalUser.ws.send(JSON.stringify(responseMessage));
      }
    }
  });

  ws.on("close", () => {
    users.splice(users.findIndex((u) => u.userId === userId), 1);
  });
});

app.get("/server-health", async (req: Request, res: Response) => {
    try {
        
        res.status(200).json({
            app: "HandiDraw-ws",
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            message: 'Server is running normally'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Database connection failed'
        });
    }
})

app.listen(8080);