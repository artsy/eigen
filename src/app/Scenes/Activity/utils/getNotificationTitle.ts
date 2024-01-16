import { pluralize } from "app/utils/pluralize"

// TODO: Consider moving the title to Metaphysics
export const getNotificationtitle = (atworksCount: number, artistName?: string | null) => {
  return `${atworksCount} New ${pluralize("Work", atworksCount)} by ${artistName}`
}
