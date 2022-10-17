import { boolean, object, string, TypeOf } from "zod"

export const uploadRealSchema = object({
    pic1: string(),
    pic2: string(),
    realInfo: string(),
    explore: boolean(),
    location: boolean(),
})

export const realByIdSchema = object({
    id: string(),
})

export type UploadRealInput = TypeOf<typeof uploadRealSchema>
export type RealByIdInput = TypeOf<typeof realByIdSchema>