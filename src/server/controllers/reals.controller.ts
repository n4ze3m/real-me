import { TRPCError } from "@trpc/server"
import moment from "moment"
import { database } from "~/utils/database"
import { Context } from "../context"
import { RealByIdInput, UploadRealInput } from "../schema/reals.schema"
import { deleteImagesFromServer } from "../services/supabase.service"

export const uploadRealHandler = async ({
    ctx,
    input
}: {
    ctx: Context,
    input: UploadRealInput
}) => {
    const me = ctx.user
    const {
        pic1,
        pic2,
        realInfo,
        explore,
    } = input


    if (!me) {
        await deleteImagesFromServer([pic1, pic2])

        return {
            code: "UNAUTHENTICATED",
            error: true
        }
    }


    const isValidRealInfo = await database.realInfo.findFirst({
        where: {
            id: realInfo
        }
    })

    if (!isValidRealInfo) {

        await deleteImagesFromServer([pic1, pic2])

        return {
            code: "INVALID_REAL_INFO",
            error: true
        }
    }


    const alreadyUploaded = await database.real.findFirst({
        where: {
            authorId: me.id,
            realInfoId: realInfo
        }
    })

    if (alreadyUploaded) {
        await deleteImagesFromServer([pic1, pic2])

        return {
            code: "ALREADY_UPLOADED",
            error: true
        }
    }

    let type = "BOTH"

    if (!explore) {
        type = "FRINEDS"
    }

    await database.real.create({
        data: {
            picOne: pic1,
            picTwo: pic2,
            authorId: me.id,
            realInfoId: realInfo,
            type,
        }
    })

    return {
        code: "SUCCESS",
        error: false
    }
}


export const exploreRealsHandler = async ({ }) => {

    const startDay = moment().startOf('day').toISOString()
    const endDay = moment().endOf('day').toISOString()

    const reals = await database.real.findMany({
        where: {
            type: "BOTH",
            createdAt: {
                gte: startDay,
                lte: endDay
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
        reals
    }
}

export const deleteRealHandler = async ({
    ctx,
    input
}: {
    ctx: Context,
    input: RealByIdInput
}) => {
    const me = ctx.user
    if (!me) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authenticated"
        })
    }

    const real = await database.real.findFirst({
        where: {
            id: input.id,
            authorId: me.id
        }
    })

    if (!real) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Real not found"
        })
    }

    await database.real.delete({
        where: {
            id: input.id
        }
    })

    await deleteImagesFromServer([real.picOne, real.picTwo])


    return {
        code: "OK",
        error: false
    }
}