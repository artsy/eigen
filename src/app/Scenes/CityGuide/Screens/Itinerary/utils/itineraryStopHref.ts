import { ItinerarySaveTarget } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

/**
 * Where a stop's entity lives on Artsy. Museums have no route of their own — they are
 * Partners like galleries — so only shows, partners and fairs need mapping.
 */
export const itineraryStopHref = (saveTarget: ItinerarySaveTarget | null): string | null => {
  if (!saveTarget) return null

  switch (saveTarget.type) {
    case "SHOW":
      return `/show/${saveTarget.slug}`
    case "PARTNER":
      return `/partner/${saveTarget.slug}`
    case "FAIR":
      return `/fair/${saveTarget.slug}`
  }
}
