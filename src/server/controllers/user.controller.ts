import { database } from "~/utils/database"
import { Context } from "../context"
import { FindUserByUsernameInput } from "../schema/user.schema"

export const currentUserHandler = async ({
    ctx
}: {
    ctx: Context
}) => {
    return ctx.user
}

export const findUserByUsernameHandler = async ({
    ctx,
    input
}: {
    ctx: Context,
    input: FindUserByUsernameInput
}) => {
    const { username } = input

    if (ctx.user) {
        const user = await database.user.findFirst({
            where: {
                username
            },
            include: {
                reals: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        reals: true,
                    }
                }
            }
        })

        if (!user) {
            return {
                code: "NOT_FOUND",
                error: true,
                user: null
            }
        }

        if (user.username === ctx.user.username) {

            return {
                code: "SAME_USER",
                error: false,
                user: {
                    id: user.id,

                    name: user.name,
                    username: user.username,
                    reals: user.reals,
                    followers: user._count?.followers,
                    following: user._count?.following,
                    realsCount: user._count?.reals,
                    showReal: true
                }
            }

        } else {
            const isFollowing = await database.buddy.findFirst({
                where: {
                    followerId: ctx.user.id,
                    followingId: user.id,
                    accepted: true
                }
            })

            const showReal = isFollowing ? true : false
            const code = isFollowing ? "FOLLOWING" : "NOT_FOLLOWING"

            return {
                code,
                error: false,
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    reals: user.reals,
                    followers: user._count?.followers,
                    following: user._count?.following,
                    realsCount: user._count?.reals,
                    showReal
                }
            }
        }

    }


    const user = await database.user.findFirst({
        where: {
            username
        },
        include: {
            reals: true,
            _count: {
                select: {
                    followers: true,
                    following: true,
                    reals: true,
                }
            }
        }
    })

    if (!user) {
        return {
            code: "NOT_FOUND",
            error: true,
            user: null
        }
    }
    return {
        code: "UNAUTHORIZED",
        error: false,
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            reals: [],
            followers: user._count?.followers,
            following: user._count?.following,
            realsCount: user._count?.reals,
            showReal: false
        }
    }


}