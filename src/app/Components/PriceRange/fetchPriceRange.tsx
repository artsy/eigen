import { fetchPriceRangeQuery } from "__generated__/fetchPriceRangeQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "react-relay"

export const fetchPriceRange = async (): Promise<{
  hasPriceRange: boolean
  hasStaleArtworkBudget: boolean
}> => {
  const result = await fetchQuery<fetchPriceRangeQuery>(
    getRelayEnvironment(),
    graphql`
      query fetchPriceRangeQuery {
        me @required(action: NONE) {
          hasPriceRange
          hasStaleArtworkBudget
        }
      }
    `,
    {},
    {
      fetchPolicy: "store-or-network",
    }
  ).toPromise()

  return {
    hasPriceRange: !!result?.me?.hasPriceRange,
    hasStaleArtworkBudget: result?.me?.hasStaleArtworkBudget ?? true,
  }
}
