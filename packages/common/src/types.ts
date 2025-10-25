import { z } from "zod"; // Converted to import
 export const CreateUserSchema = z.object({ // Exported
    email: z.string().min(3).max(30),
    password: z.string(),
    name: z.string()
})

 export const SigninSchema = z.object({ // Exported
    email: z.string().min(3).max(30),
    password: z.string(),
})

// export const CreateRoomSchema = z.object({
//     slug: z.string().min(3).max(20),
//     name: z.string()
// })