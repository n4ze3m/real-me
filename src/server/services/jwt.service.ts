import { Prisma } from "@prisma/client";
import { signJwt } from "../utils/jwt";

export const signToken = async (user: Prisma.UserCreateInput) => {
    const access_token = signJwt({
        sub: user.id,
    }, 'accessTokenPrivateKey', {
        expiresIn: 60 * 60 * 24 * 7,
    })

    const refresh_token = signJwt({
        sub: user.id,
    }, 'refreshTokenPrivateKey', {
        expiresIn: 60 * 60 * 24 * 30,
    })


    return {
        access_token,
        refresh_token,
    }
}