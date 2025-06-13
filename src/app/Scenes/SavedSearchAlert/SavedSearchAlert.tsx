import { SavedSearchAlertQuery } from "__generated__/SavedSearchAlertQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { graphql, QueryRenderer } from "react-relay"

export const SavedSearchAlertScreenQuery = graphql`
  query SavedSearchAlertQuery($savedSearchAlertId: String!) {
    me {
      alert(id: $savedSearchAlertId) {
        ...SavedSearchAlert_alert @relay(mask: false)
      }
    }
  }
`

export const alertFragment = graphql`
  fragment SavedSearchAlert_alert on Alert {
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
`

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

  return (
    <QueryRenderer<SavedSearchAlertQuery>
      environment={getRelayEnvironment()}
      query={SavedSearchAlertScreenQuery}
      render={render}
      variables={{ savedSearchAlertId }}
    />
  )
}
