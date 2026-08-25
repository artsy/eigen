import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { uniq } from "lodash"

export const extractShowAndFairMaps = (
  shows: readonly Show[],
  upcomingShows: readonly Show[],
  fairs: readonly Fair[]
): { shows: { [key: string]: Show }; fairs: { [key: string]: Fair } } => {
  const showsMap: { [key: string]: Show } = {}
  const fairsMap: { [key: string]: Fair } = {}

  const savedUpcomingShows = upcomingShows.filter((node) => node.is_followed)
  const concatedShows = uniq(shows.concat(savedUpcomingShows))

  concatedShows.forEach((node) => {
    if (!node.location?.coordinates) {
      return
    }

    showsMap[node.slug] = node
  })

  fairs.forEach((node) => {
    if (!node.location?.coordinates) {
      return
    }

    fairsMap[node.slug] = {
      ...node,
      type: "Fair",
    }
  })

  return { shows: showsMap, fairs: fairsMap }
}
