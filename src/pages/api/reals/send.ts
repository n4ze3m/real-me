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

    await database.realInfo.create({
        data: {}
    })

    const users = await database.user.findMany({})
    // for demo purposes
    await database.real.updateMany({
        where: {
            realInfoId: "mock"
        },
        data: {
            createdAt: new Date().toISOString(),
        }
    })
    return res.status(200).json({ message: 'Sent' })
}
