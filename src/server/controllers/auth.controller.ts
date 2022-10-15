import { AuthUserEmailInput, AuthUserEmailVerifyInput, AuthUserRegisterInput } from "../schema/user.schema";
import { otp } from "~/utils/otp"
import { TRPCError } from "@trpc/server";
import { jwtConfig } from "../utils/config";
import { OptionsType } from "cookies-next/lib/types";
import { Context } from "../context";
import { database } from "~/utils/database";
import { signToken } from "../services/jwt.service";
import { setCookie } from "cookies-next";

const cookieOptions: OptionsType = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
};

const accessTokenCookieOptions = {
    ...cookieOptions,
    expires: new Date(Date.now() + jwtConfig.accessTokenExpiresIn * 60 * 1000),
};

const refreshTokenCookieOptions = {
    ...cookieOptions,
    expires: new Date(
        Date.now() + jwtConfig.refreshTokenExpiresIn * 60 * 1000
    ),
};

export const authEmailSendHandler = async ({
    input
}: {
    input: AuthUserEmailInput
}) => {
    const { email } = input
    // send otp
    const response = await otp.sendOtp({
        to: email,
        type: "email",
        otpOptions: {
            length: 4
        }
    })
    if (!response) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send OTP",
        })
    }

    return {
        success: true,
    }
}

export const authEmailVerifyHandler = async ({
    input,
    ctx,
}: {
    input: AuthUserEmailVerifyInput,
    ctx: Context
}) => {
    const { email, otp: userOtp } = input

    const verifyResponse = await otp.verifyOtp({
        otp: userOtp,
        to: email,
        type: "email",
    })

    if (!verifyResponse.verify) {
        return {
            status: false,
            accessToken: null,
            code: "MISSING_OTP",
        }
    }

    const user = await database.user.findFirst({
        where: {
            email
        }
    })

    if (!user) {
        return {
            status: false,
            accessToken: null,
            code: "UNREGISTERED_USER",
        }
    }

    const {
        access_token,
        refresh_token
    } = await signToken(user)

    setCookie('access_token', access_token, {
        req: ctx.req,
        res: ctx.res,
        ...accessTokenCookieOptions,
    })

    setCookie('refresh_token', refresh_token, {
        req: ctx.req,
        res: ctx.res,
        ...refreshTokenCookieOptions,
    })

    setCookie('logged_in', 'true', {
        req: ctx.req,
        res: ctx.res,
        ...accessTokenCookieOptions,
        httpOnly: false,
    });

    return {
        success: true,
        accessToken: access_token,
        code: "SUCCESS",
    }
}

export const authRegisterHandller = async ({
    input,
    ctx
}: {
    input: AuthUserRegisterInput,
    ctx: Context
}) => {
    const { email, name, username } = input

    const isEmailExists = await database.user.findFirst({
        where: {
            email
        }
    })

    if (isEmailExists) {
        return {
            status: false,
            accessToken: null,
            code: "EMAIL_EXISTS",
        }
    }

    const isUsernameExists = await database.user.findFirst({
        where: {
            username
        }
    })

    if (isUsernameExists) {
        return {
            status: false,
            accessToken: null,
            code: "USERNAME_EXISTS",
        }
    }

    const user = await database.user.create({
        data: {
            email,
            name,
            username
        }
    })

    const {
        access_token,
        refresh_token
    } = await signToken(user)

    setCookie('access_token', access_token, {
        req: ctx.req,
        res: ctx.res,
        ...accessTokenCookieOptions,
    })

    setCookie('refresh_token', refresh_token, {
        req: ctx.req,
        res: ctx.res,
        ...refreshTokenCookieOptions,
    })

    setCookie('logged_in', 'true', {
        req: ctx.req,
        res: ctx.res,
        ...accessTokenCookieOptions,
        httpOnly: false,
    });

    return {
        success: true,
        accessToken: access_token,
        code: "SUCCESS",
    }
}

const logout = ({ ctx: { req, res } }: { ctx: Context }) => {
    setCookie('access_token', '', { req, res, maxAge: -1 });
    setCookie('refresh_token', '', { req, res, maxAge: -1 });
    setCookie('logged_in', '', { req, res, maxAge: -1 });
};

export const logoutHandler = async ({ ctx }: { ctx: Context }) => {
    try {
        logout({ ctx });
        return { status: 'success' };
    } catch (err: any) {
        throw err;
    }
};
