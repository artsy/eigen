export const notificationTypes = ["all", "alerts", "follows", "offers"] as const

export type NotificationType = (typeof notificationTypes)[number]
