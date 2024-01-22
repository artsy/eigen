export const notificationTypes = ["all", "alerts", "offers"] as const

export type NotificationType = typeof notificationTypes[number]
