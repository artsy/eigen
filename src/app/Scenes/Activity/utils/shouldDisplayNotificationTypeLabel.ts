export const shouldDisplayNotificationTypeLabel = (notificationType: string) => {
  return ["ARTWORK_ALERT", "ARTICLE_FEATURED_ARTIST"].includes(notificationType)
}
