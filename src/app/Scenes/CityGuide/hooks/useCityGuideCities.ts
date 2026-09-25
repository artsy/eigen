import { useCityGuideCitiesQuery } from "__generated__/useCityGuideCitiesQuery.graphql"
import { CityData } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { graphql, useLazyLoadQuery } from "react-relay"

export const cityGuideCitiesQuery = graphql`
  query useCityGuideCitiesQuery {
    cityGuideCities {
      slug
      name
      coordinates {
        lat
        lng
      }
    }
  }
`

/** The cities with a City Guide, in display order. Fetched once per session: later screens hit the store. */
export const useCityGuideCities = (): CityData[] => {
  const data = useLazyLoadQuery<useCityGuideCitiesQuery>(
    cityGuideCitiesQuery,
    {},
    { fetchPolicy: "store-or-network" }
  )

  const cities = data.cityGuideCities.flatMap(({ slug, name, coordinates }) =>
    coordinates?.lat != null && coordinates.lng != null
      ? [{ slug, name, coordinates: { lat: coordinates.lat, lng: coordinates.lng } }]
      : []
  )

  // Caught by the screens' error fallback: without a city there is nothing to show.
  if (!cities.length) {
    throw new Error("No City Guide cities")
  }

  return cities
}
