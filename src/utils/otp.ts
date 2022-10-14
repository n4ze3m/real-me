import {
    CourierOtp
} from "courier-otp"

declare global {
    var otp: CourierOtp | undefined;
}

export const otp = global.otp || new CourierOtp({
    redisUrl: process.env.REDIS_URL!,
    courierTemplateId: process.env.COURIER_AUTH_TEMPLATE_ID!,
    courierApiKey: process.env.COURIER_API_KEY!,
})