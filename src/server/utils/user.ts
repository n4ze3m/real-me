import { NextApiRequest, NextApiResponse } from "next";
import { database } from "~/utils/database";
import { verifyJwt } from "./jwt";

export const deserializeUser = async ({
    req,
    res,
}: {
    req: NextApiRequest;
    res: NextApiResponse;
}) => {
    if (req.cookies.access_token) {
        const user = verifyJwt<{ sub: string }>(req.cookies.access_token, "accessTokenPublicKey");
        // if no user
        if (!user) {
            // remove cookies
            res.setHeader("Set-Cookie", [
                "access_token=; Path=/; HttpOnly; Max-Age=0",
                "refresh_token=; Path=/; HttpOnly; Max-Age=0",
            ]);
            return {
                user: null,
                res,
                req,
            }
        }
        const userExist = await database.user.findUnique({
            where: {
                id: user.sub,
            }
        })

        if (!userExist) {
            res.setHeader("Set-Cookie", [
                "access_token=; Path=/; HttpOnly; Max-Age=0",
                "refresh_token=; Path=/; HttpOnly; Max-Age=0",
            ]);
            return {
                user: null,
                res,
                req,
            }
        }

        return {
            user: userExist,
            res,
            req,
        }

    }

    return {
        user: null,
        res,
        req,
    };
};
