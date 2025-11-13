import { Notification } from '../models/message/notificationModel'
import { NotificationTemplate } from '../models/message/notificationTemplateModel'

interface NotificationData {
  senderUsername: string
  receiverUsername: string
  senderPicture: string
  receiverPicture: string
  senderName: string
  receiverName: string
  content?: string
  gender?: string
  from?: string
  str1?: string
}

export const sendNotification = async (
  templateName: string,
  data: NotificationData
) => {
  const notificationTemp = await NotificationTemplate.findOne({
    name: templateName,
  })

  if (!notificationTemp) {
    throw new Error(`Notification template '${templateName}' not found.`)
  }

  const click_here =
    templateName === 'friend_request'
      ? `<a href="/home/chat/${data.from}/${data.senderUsername}" class="text-[var(--custom)]">click here</a>`
      : ''

  const content = notificationTemp.content
    .replace('{{sender_username}}', data.senderUsername)
    .replace('{{school}}', data.str1)
    .replace('{{click_here}}', click_here)

  const notification = await Notification.create({
    greetings: notificationTemp.greetings,
    name: notificationTemp.name,
    title: notificationTemp.title,
    senderUsername: data.senderUsername,
    receiverUsername: data.receiverUsername,
    senderName: data.senderName,
    receiverName: data.receiverName,
    senderPicture: data.senderPicture,
    receiverPicture: data.receiverPicture,
    content,
  })

  const count = await Notification.countDocuments({
    receiverUsername: data.receiverUsername,
    unread: true,
  })

  return { Notification: notification, count }
}
