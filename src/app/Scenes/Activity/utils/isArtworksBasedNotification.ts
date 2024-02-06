export const isArtworksBasedNotification = (notificationType: string) => {
  return ["ARTWORK_ALERT", "ARTWORK_PUBLISHED", "PARTNER_OFFER_CREATED"].includes(notificationType)
}
