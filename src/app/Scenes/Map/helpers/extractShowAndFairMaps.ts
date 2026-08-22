import { GlobalMap_viewer$data } from "__generated__/GlobalMap_viewer.graphql"
import { Fair, Show } from "app/utils/cityGuide/types"
import { extractNodes } from "app/utils/extractNodes"
import { uniq } from "lodash"

export const extractShowAndFairMaps = (
  city: GlobalMap_viewer$data["city"]
): { shows: { [key: string]: Show }; fairs: { [key: string]: Fair } } => {
  const shows: { [key: string]: Show } = {}
  const fairs: { [key: string]: Fair } = {}

  if (!city) {
    return { shows, fairs }
  }

  const savedUpcomingShows = extractNodes(city.upcomingShows).filter((node) => node.is_followed)
  const cityShows = extractNodes(city.shows)
  const concatedShows = uniq(cityShows.concat(savedUpcomingShows as any))

  concatedShows.forEach((node) => {
    if (!node || !node.location || !node.location.coordinates) {
      return
    }

    shows[node.slug] = node
  })

  extractNodes(city.fairs).forEach((node) => {
    if (!node || !node.location || !node.location.coordinates) {
      return
    }

    fairs[node.slug] = {
      ...node,
      type: "Fair",
    }
  })

  return { shows, fairs }
}
