// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CourierClient } from '@trycourier/courier'
import moment from 'moment'
import type { NextApiRequest, NextApiResponse } from 'next'
import { database } from '~/utils/database'
import { getUrl } from '~/utils/url'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {


    const startDay = moment().startOf('day').toISOString()
    const endDay = moment().endOf('day').toISOString()

    const isAlreadySent = await database.realInfo.findFirst({
        where: {
            createdAt: {
                gte: startDay,
                lte: endDay
            }
        }
    })

    if (isAlreadySent) {
        res.status(200).json({ message: 'Already sent' })
        return
    }

    const realInfo = await database.realInfo.create({
        data: {}
    })

    const users = await database.user.findMany({})
    if (users.length > 0) {
        const courier = CourierClient({ authorizationToken: process.env.COURIER_API_KEY_NOTIFICATIONS! });


        const courierUsers = users.map(user => {
            return {
                user_id: user.id,
                email: user.email,
                courier: {
                    channel: process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY!,
                },
            }
        })

        let title = 'Time to get real'

        let message = '2 min to get capture a real moment'

        const { requestId} = await courier.send({
            message: {
                to: courierUsers,
                template: process.env.COURIER_NOTIFICATION_TEMPLATE_ID!,
                data: {
                    title,
                    message,
                    subject: title,
                    btn: 'Capture',
                    click: `${getUrl()}explore/reals/post/${realInfo.id}`
                },
            },

        })

        return res.status(200).json({ requestId })
    }

    return res.status(200).json({ message: 'Sent' })
}
