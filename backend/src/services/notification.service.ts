import { NotificationModel } from '../models/notification.model'
import { NOTIFICATION_TYPE } from '../types/notification.type'
import { QueryFilter } from '../utils/filter.util'

export class NotificationService {
    static async pushNotiToSystem({
        type = NOTIFICATION_TYPE.SHOP_001,
        receiver,
        sender,
        options = {}
    }: {
        type: string
        receiver: string
        sender: string
        options?: any
    }) {
        let noti_content

        if (type === NOTIFICATION_TYPE.SHOP_001) {
            noti_content = `${sender} added a new product: @@@@`
        } else if (type === NOTIFICATION_TYPE.PROMOTION_001) noti_content = `${sender} created a new promotion: @@@@`

        return NotificationModel.create({
            type,
            sender,
            // receiver,
            content: noti_content,
            options
        })
    }

    static async listNotiByUser({
        userId,
        type = 'ALL',
        isRead = false
    }: {
        userId: string
        type: string
        isRead: boolean
    }) {
        const match: QueryFilter = {
            receiver: userId
        }
        if (type !== 'ALL') match['type'] = type

        return NotificationModel.aggregate([
            {
                $match: match
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    type: 1,
                    sender: 1,
                    receiver: 1,
                    content: 1,
                    createdAt: 1,
                    isRead: 1,
                    options: 1
                }
            }
        ])
    }
}
