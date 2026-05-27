import { z } from "zod"

export const registrationSchema = z
  .object({
    userId: z.string().min(1, "아이디를 입력하세요"),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
    passwordConfirm: z.string(),
    name: z.string().min(1, "이름을 입력하세요"),
    birthDate: z.string().min(1, "생년월일을 선택하세요"),
    gender: z.enum(["unknown", "male", "female", "other"]),
    bloodType: z.enum([
      "unknown",
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ]),
    illness: z.string().optional(),
    medications: z.string().optional(),
    allergies: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  })

export type RegistrationDto = z.infer<typeof registrationSchema>
