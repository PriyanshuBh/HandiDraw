import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { signupHandler } from "../controlers/signupHanlder.js";
import { signinHandler } from "../controlers/signinHandler.js";
import { createRoomHandler } from "../controlers/createRoomHandler.js";
import { getShapesHandler } from "../controlers/getShapesHandler.js";
import { getRoomHandler } from "../controlers/getRoomHandler.js";
import { checkAuth } from "../controlers/checkAuth.js";
import { logoutHandler } from "../controlers/logoutHandler.js";
import { joinRoomHandler } from "../controlers/joinRoomHandler.js";
import { getUsers } from "../controlers/getUsers.js";
import { deleteRoomHandler } from "../controlers/deleteRoomHandler.js";
import { tokenHandler } from "../controlers/tokenHandler.js";
import { leaveRoomHandler } from "../controlers/leaveRoomHandler.js";
import { getUsersRoomHandler } from "../controlers/getUsersRoomsHandler.js";
import { generateDrawingHandler } from "../controlers/generateDrawingHandler.js";
import { checkSetupToken, setupGoogleAccountHandler } from "../controlers/setupGoogleAccountHandler.js";
import { initiateSignUpHandler } from "../controlers/initiateSignupHandler.js";
import { verifyOtpHandler } from "../controlers/verifyOTPHandler.js";

const userRouter: Router = Router();

// signup
// step 1: initiate signup
userRouter.post("/initiate-signup", initiateSignUpHandler)

// step 2: verify otp
userRouter.post("/verify-otp", verifyOtpHandler)

// step 3: complete signup
userRouter.post("/complete-signup", signupHandler)

userRouter.post("/signin", signinHandler);

userRouter.get("/check-setup-session", checkSetupToken);
userRouter.post("/setup-google-account", setupGoogleAccountHandler);


userRouter.use(authMiddleware)

userRouter.post("/create-room", createRoomHandler);

userRouter.post("/join-room/:roomId", joinRoomHandler)

userRouter.put("/leave-room/:roomId", leaveRoomHandler);

// todo: delete room
userRouter.delete("/delete-room/:roomId", deleteRoomHandler);

userRouter.get("/getUsers/:roomId", getUsers)
        
userRouter.get("/shapes/:roomId", getShapesHandler);

userRouter.get("/room/:roomId", getRoomHandler);

userRouter.get("/room", getUsersRoomHandler);

userRouter.get("/check", checkAuth)

userRouter.post("/logout", logoutHandler)

userRouter.get("/get-token", tokenHandler)

userRouter.post("/generate-drawing", generateDrawingHandler)

export default userRouter;