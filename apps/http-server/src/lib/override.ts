import { IUser } from "../middleware/auth.js"


declare global{
    namespace Express {
        interface Request {
            userId: string
            user: IUser
        }
    }
}