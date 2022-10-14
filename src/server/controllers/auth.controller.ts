import { AuthUserEmailInput } from "../schema/user.schema";
import { otp } from "~/utils/otp"
import { TRPCError } from "@trpc/server";

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