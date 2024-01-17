export const shouldDisplayNotificationTypeLabel = (notificationType: string) => {
  return ["ARTWORK_ALERT", "ARTICLE_FEATURED_ARTIST", "PARTNER_OFFER_CREATED"].includes(
    notificationType
  )
}
