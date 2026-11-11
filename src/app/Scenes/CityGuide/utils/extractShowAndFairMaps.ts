import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { uniq } from "lodash"

export const extractShowAndFairMaps = (
  shows: readonly Show[],
  upcomingShows: readonly Show[],
  fairs: readonly Fair[]
): { shows: { [key: string]: Show }; fairs: { [key: string]: Fair } } => {
  const showsMap: { [key: string]: Show } = {}
  const fairsMap: { [key: string]: Fair } = {}

  // Every upcoming show, not just followed ones: this is only a slug lookup for tapped pins, and
  // which upcoming shows get a pin at all is the filters' call (see `bucketCityResults`).
  const concatedShows = uniq(shows.concat(upcomingShows))

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
