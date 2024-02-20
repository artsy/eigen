export const notificationTypes = ["all", "alerts", "offers", "follows"] as const

export type NotificationType = (typeof notificationTypes)[number]
