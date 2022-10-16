import { database } from "~/utils/database"
import { Context } from "../context"
import { UploadRealInput } from "../schema/reals.schema"
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

    if(!explore) {
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