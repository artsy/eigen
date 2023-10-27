import { SavedSearchAlertQuery } from "__generated__/SavedSearchAlertQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import { graphql, QueryRenderer } from "react-relay"

interface SearchCriteriaAlertBaseProps {
  savedSearchAlertId: string
  render: (renderProps: {
    error: Error | null
    props: SavedSearchAlertQuery["response"] | null
    retry: (() => void) | null
  }) => React.ReactNode
}

export const SavedSearchAlertQueryRenderer: React.FC<SearchCriteriaAlertBaseProps> = (props) => {
  const { savedSearchAlertId, render } = props

  const { localizedUnit } = useLocalizedUnit()

  return (
    <QueryRenderer<SavedSearchAlertQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query SavedSearchAlertQuery($savedSearchAlertId: ID!, $metric: String!) {
          me {
            savedSearch(id: $savedSearchAlertId) {
              acquireable
              additionalGeneIDs
              artistIDs
              atAuction
              attributionClass
              colors
              dimensionRange
              displayName(metric: $metric)
              sizes
              height
              inquireableOnly
              locationCities
              majorPeriods
              materialsTerms
              offerable
              partnerIDs
              priceRange
              userAlertSettings {
                email
                name
                push
                details
              }
              width
            }
          }
        }
      `}
      render={render}
      variables={{ savedSearchAlertId, metric: localizedUnit }}
      cacheConfig={{ force: true }}
    />
  )
}
