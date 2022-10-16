import { CourierClient } from "@trycourier/courier";

type ICNotification = {
    id: string;
    email: string;
    message: string;
    title: string;
    subject: string;
    btn: string;
    click: string;
}


export const courierNotification = async ({
    btn,
    click,
    email,
    id,
    message,
    subject,
    title
}: ICNotification) => {
    const courier = CourierClient({ authorizationToken: process.env.COURIER_API_KEY_NOTIFICATIONS! });
    await courier.send({
        message: {
            to: {
                email: email,
                user_id: id,
                courier: {
                    channel: process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY!,
                },
            },
            template: process.env.COURIER_NOTIFICATION_TEMPLATE_ID!,
            data: {
                title,
                message,
                subject,
                btn,
                click
            },
        },
    });
}