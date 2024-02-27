import { SearchCriteriaQuery } from "__generated__/SearchCriteriaQuery.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { isNull } from "lodash"
import { graphql, QueryRenderer, Environment } from "react-relay"

export interface SearchCriteriaQueryRendererProps {
  environment?: Environment
  alertId?: string
  render: {
    renderPlaceholder: () => React.ReactElement
    renderComponent: (args: {
      fetchCriteriaError: Error | null
      savedSearchCriteria: SearchCriteriaAttributes | null
    }) => React.ReactElement
  }
}

export const SearchCriteriaQueryRenderer: React.FC<SearchCriteriaQueryRendererProps> = (props) => {
  const { render, alertId, environment = getRelayEnvironment() } = props
  const { renderComponent, renderPlaceholder } = render

  if (alertId) {
    return (
      <QueryRenderer<SearchCriteriaQuery>
        environment={environment}
        query={graphql`
          query SearchCriteriaQuery($alertId: String!) {
            me {
              email
              alert(id: $alertId) {
                acquireable
                additionalGeneIDs
                atAuction
                attributionClass
                colors
                dimensionRange
                height
                inquireableOnly
                locationCities
                majorPeriods
                materialsTerms
                offerable
                partnerIDs
                priceRange
                width
                sizes
              }
            }
          }
        `}
        render={({ props: relayProps, error }) => {
          // Loading state
          if (isNull(error) && isNull(relayProps)) {
            return <ProvidePlaceholderContext>{renderPlaceholder()}</ProvidePlaceholderContext>
          }
          const savedSearchCriteria = (relayProps?.me?.alert as SearchCriteriaAttributes) ?? null

          return renderComponent({
            fetchCriteriaError: error,
            savedSearchCriteria,
          })
        }}
        variables={{ alertId }}
        cacheConfig={{ force: true }}
      />
    )
  }

  return renderComponent({
    fetchCriteriaError: null,
    savedSearchCriteria: null,
  })
}
