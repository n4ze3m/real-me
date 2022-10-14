import { object, string, TypeOf } from "zod"

export const authEmailSchema = object({
    email: string().email({ message: "Invalid email" }),
})


export type AuthUserEmailInput = TypeOf<typeof authEmailSchema>