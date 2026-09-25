import { useCityGuideCitiesQuery } from "__generated__/useCityGuideCitiesQuery.graphql"
import { CityData } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { graphql, useLazyLoadQuery } from "react-relay"

const query = graphql`
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
    query,
    {},
    { fetchPolicy: "store-or-network" }
  )

  return data.cityGuideCities.map((city) => ({
    slug: city.slug,
    name: city.name,
    coordinates: { lat: city.coordinates?.lat ?? 0, lng: city.coordinates?.lng ?? 0 },
  }))
}
