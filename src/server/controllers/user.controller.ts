import { database } from "~/utils/database"
import { Context } from "../context"
import { FindUserByUsernameInput, FollowBuddyInput } from "../schema/user.schema"
import crypto from "crypto";
import { courierNotification } from "../services/courier.service";
import moment from "moment";

export const currentUserHandler = async ({
    ctx
}: {
    ctx: Context
}) => {
    if (ctx.user) {
        const apiKey = process.env.COURIER_API_KEY_NOTIFICATIONS!
        const userId = ctx.user.id


        const newReal = await database.realInfo.findFirst({
            where: {
                createdAt: {
                    gte: moment().startOf('day').toDate(),
                    lte: moment().endOf('day').toDate()
                }
            }
        })

        let userPosted = true;
        let realPath = "";


        if (newReal) {
            const isUserPosted = await database.real.findFirst({
                where: {
                    authorId: ctx.user.id,
                    realInfoId: newReal.id
                }
            })
            if(!isUserPosted){
                userPosted = false
                realPath = `/explore/reals/post/${newReal.id}`
            }
        }



        const computedUserHmac =
            crypto
                .createHmac("sha256", apiKey)
                .update(userId)
                .digest("hex");


        return {
            user: ctx.user,
            courierHash: computedUserHmac,
            hasPendingRequests: false,
            userPosted,
            realPath
        }
    }

    return null
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
                }
            })

            const showReal = isFollowing && isFollowing.accepted
            const code = isFollowing ? isFollowing.accepted ? "FOLLOWING" : "REQUESTED" : "NOT_FOLLOWING"


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
            },
            createdAt: {
                // today 
                gte: moment().startOf("day").toISOString(),
                lte: moment().endOf("day").toISOString()
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

export const followBuddyHandler = async ({
    ctx,
    input
}: {
    ctx: Context,
    input: FollowBuddyInput
}) => {
    if (!ctx.user) {
        return {
            code: "UNAUTHORIZED",
            error: true
        }
    }

    const { followingId } = input
    const followingUserExist = await database.user.findFirst({
        where: {
            id: followingId
        }
    })

    if (!followingUserExist) {
        return {
            code: "NOT_FOUND",
            error: true
        }
    }

    // check if user is already following
    const isFollowing = await database.buddy.findFirst({
        where: {
            followerId: ctx.user.id,
            followingId,
        }
    })

    if (isFollowing) {
        // unfollow
        await database.buddy.delete({
            where: {
                followerId_followingId: {
                    followerId: ctx.user.id,
                    followingId
                }
            }
        })

        return {
            code: "UNFOLLOWED",
            error: false
        }
    }

    // follow
    await database.buddy.create({
        data: {
            accepted: false,
            followerId: ctx.user.id,
            followingId
        }
    })
    const message = `You have a new follower request from ${ctx.user.name}`
    await courierNotification({
        id: followingUserExist.id,
        email: followingUserExist.email,
        message,
        title: "New follower request",
        subject: "New follower request",
        btn: "View Pending Requests",
        click: "https://reals.vercel.app/pending-requests"
    })

    return {
        code: "FOLLOWED",
        error: false
    }
}

export const buddiesList = async ({
    ctx
}: {
    ctx: Context
}) => {
    const me = ctx.user

    if (!me) {
        return {
            code: "UNAUTHORIZED",
            error: true,
            buddies: {
                pending: [],
                buddies: [],
            }
        }
    }

    const pending = await database.buddy.findMany({
        where: {
            accepted: false,
            followingId: me.id
        },
        include: {
            follower: true
        }
    })

    const following = await database.buddy.findMany({
        where: {
            accepted: true,
            followerId: me.id
        },
        include: {
            following: true
        }
    })

    const followers = await database.buddy.findMany({
        where: {
            accepted: true,
            followingId: me.id
        },
        include: {
            follower: true
        }
    })


    // mix the followers and following
    const buddies = [
        ...followers.map(f => f.follower),
        ...following.map(f => f.following)
    ].filter((buddy, index, self) => {
        return self.findIndex(b => b.id === buddy.id) === index
    })

    return {
        code: "OK",
        error: false,
        buddies: {
            pending,
            buddies
        }
    }
}

export const acceptOrRemoveBuddyHandler = async ({
    ctx,
    input
}: {
    ctx: Context,
    input: FollowBuddyInput
}) => {
    const me = ctx.user
    if (!me) {
        return {
            code: "UNAUTHORIZED",
            error: true
        }
    }


    const { followingId } = input


    const isFollowerExist = await database.user.findFirst({
        where: {
            id: followingId
        }
    })

    if (!isFollowerExist) {
        return {
            code: "NOT_FOUND",
            error: true
        }
    }


    await database.buddy.update({
        where: {
            followerId_followingId: {
                followerId: followingId,
                followingId: me.id
            }
        },
        data: {
            accepted: true
        }
    })

    const message = `Your request to follow ${me.name} has been accepted`
    await courierNotification({
        id: isFollowerExist.id,
        email: isFollowerExist.email,
        message,
        title: "Request Accepted",
        subject: "Request Accepted",
        btn: "View all buddies",
        click: "https://reals.vercel.app/pending-requests"
    })



    return {
        code: "OK",
        error: false
    }
}