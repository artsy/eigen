import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { StopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"

interface Options {
  citySlug: string
  itineraryId: string
  shareToken?: string | null
  isCustom: boolean
}

/**
 * Where tapping a stop goes, in the itinerary's list and on its map alike.
 *
 * A custom stop's only link is wherever the curator found it, which leads out of Artsy, so it
 * goes to its own screen instead. A stop with an entity opens the entity's page, told which
 * stop it came from when the curator left a note there for it to show.
 */
export const itineraryStopHref = (
  stop: Pick<ItineraryStop, "internalID" | "note">,
  card: Pick<StopCardFields, "href">,
  { citySlug, itineraryId, shareToken, isCustom }: Options
): string | undefined => {
  if (isCustom) {
    return `/city-guide/${citySlug}/itinerary/${itineraryId}/stop/${stop.internalID}`
  }

  if (!card.href || !stop.note?.trim()) return card.href

  const params = [
    `stopID=${encodeURIComponent(stop.internalID)}`,
    shareToken ? `shareToken=${encodeURIComponent(shareToken)}` : null,
  ]
    .filter(Boolean)
    .join("&")

  return `${card.href}${card.href.includes("?") ? "&" : "?"}${params}`
}
