import { getSavedSearchIdByCriteriaQuery } from "__generated__/getSavedSearchIdByCriteriaQuery.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "app/relay/createEnvironment"
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
    defaultEnvironment,
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
