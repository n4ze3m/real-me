import { object, string, TypeOf } from "zod"

export const authEmailSchema = object({
    email: string().email({ message: "Invalid email" }),
})
export const authEmailVerifySchema = object({
    email: string().email({ message: "Invalid email" }),
    otp: string().min(4, { message: "Invalid OTP" }),
})

export const authRegisterSchema = object({
    email: string().email({ message: "Invalid email" }),
    name: string().min(3, { message: "Name must be at least 3 characters" }),
    username: string().min(3, { message: "Username must be at least 3 characters" }),
})

export const findUserByUsername = object({
    username: string().min(3, { message: "Username must be at least 3 characters" }),
})

export type AuthUserEmailInput = TypeOf<typeof authEmailSchema>
export type AuthUserEmailVerifyInput = TypeOf<typeof authEmailVerifySchema>
export type AuthUserRegisterInput = TypeOf<typeof authRegisterSchema>
export type FindUserByUsernameInput = TypeOf<typeof findUserByUsername>