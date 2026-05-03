import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

export type LoginInput = z.infer<typeof loginSchema>;
