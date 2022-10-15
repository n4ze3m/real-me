import { Context } from "../context"

export const currentUserHandler = async ({
    ctx
}: {
    ctx: Context
}) => {
    return ctx.user
}