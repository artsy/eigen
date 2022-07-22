import { getSavedSearchIdByCriteriaQuery } from "__generated__/getSavedSearchIdByCriteriaQuery.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { fetchQuery, graphql } from "relay-runtime"

export const getSavedSearchIdByCriteria = async (criteria: SearchCriteriaAttributes) => {
  const query = graphql`
    query getSavedSearchIdByCriteriaQuery($criteria: SearchCriteriaAttributes) {
      me {
        savedSearch(criteria: $criteria) {
          internalID
        }
      }
    }
  `

  const request = fetchQuery<getSavedSearchIdByCriteriaQuery>(
    getRelayEnvironment(),
    query,
    { criteria },
    {
      networkCacheConfig: {
        force: true,
      },
    }
  )
  const response = await request.toPromise()

  return response?.me?.savedSearch?.internalID
}
