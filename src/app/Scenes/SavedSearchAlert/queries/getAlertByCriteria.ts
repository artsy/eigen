import { getAlertByCriteriaQuery } from "__generated__/getAlertByCriteriaQuery.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { fetchQuery, graphql } from "react-relay"

export const getAlertByCriteria = async (criteria: SearchCriteriaAttributes) => {
  const query = graphql`
    query getAlertByCriteriaQuery($criteria: PreviewSavedSearchAttributes) {
      me {
        alertsConnection(first: 1, attributes: $criteria) {
          edges {
            node {
              internalID
            }
          }
        }
      }
    }
  `

  const request = fetchQuery<getAlertByCriteriaQuery>(
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

  const alerts = extractNodes(response?.me?.alertsConnection)

  if (alerts.length == 0) return

  return alerts[0].internalID
}
