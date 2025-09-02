import { Request, Response } from "express";
import { hash } from "bcrypt";
import z from "zod";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().email(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .refine((password) => /[A-Z]/.test(password), {
          message: "Password must contain at least one uppercase letter",
        })
        .refine((password) => /[0-9]/.test(password), {
          message: "Password must contain at least one number",
        })
        .refine((password) => /[^A-Za-z0-9]/.test(password), {
          message: "Password must contain at least one special character",
        }),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const hashedPassword = await hash(password, 8);

    return response.json({ message: "ok", hashedPassword });
  }
}

export { UsersController };
