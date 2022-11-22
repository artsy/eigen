export const notificationTypes = ["all", "alerts"] as const
export type NotificationType = typeof notificationTypes[number]
