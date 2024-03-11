import { SavedSearchAlertQuery } from "__generated__/SavedSearchAlertQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { graphql, QueryRenderer } from "react-relay"

interface SearchCriteriaAlertBaseProps {
  alertId: string
  render: (renderProps: {
    error: Error | null
    props: SavedSearchAlertQuery["response"] | null
    retry: (() => void) | null
  }) => React.ReactNode
}

export const SavedSearchAlertQueryRenderer: React.FC<SearchCriteriaAlertBaseProps> = (props) => {
  const { alertId, render } = props

  return (
    <QueryRenderer<SavedSearchAlertQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query SavedSearchAlertQuery($alertId: String!) {
          me {
            alert(id: $alertId) {
              acquireable
              additionalGeneIDs
              artistIDs
              artistSeriesIDs
              atAuction
              attributionClass
              colors
              dimensionRange
              displayName
              sizes
              height
              inquireableOnly
              locationCities
              majorPeriods
              materialsTerms
              offerable
              partnerIDs
              priceRange
              settings {
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
      variables={{ alertId }}
      cacheConfig={{ force: true }}
    />
  )
}
