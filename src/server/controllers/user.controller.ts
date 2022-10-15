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

export const buddiesTimlineHandler = async ({
    ctx
}: {
    ctx: Context
}) => {
    if (!ctx.user) {
        return {
            code: "UNAUTHORIZED",
            error: true,
            reals: null
        }
    }

    const following = await database.buddy.findMany({
        where: {
            accepted: true,
            followerId: ctx.user.id
        },
        select: {
            followingId: true
        }
    })

    if (following.length === 0) {
        return {
            code: "NO_BUDDIES",
            error: false,
            reals: []
        }
    }

    const followingIds = following.map(f => f.followingId)

    const timeline = await database.real.findMany({
        where: {
            authorId: {
                in: followingIds
            }
        },
        include: {
            author: true,
            realInfo: true,
        },
        orderBy: [
            {
                createdAt: "desc"
            }
        ]
    })


    return {
        code: "OK",
        error: false,
        reals: timeline
    }

}