export const isArtworksBasedNotification = (notificationType: string) => {
  return ["ARTWORK_ALERT", "ARTWORK_PUBLISHED"].includes(notificationType)
}
