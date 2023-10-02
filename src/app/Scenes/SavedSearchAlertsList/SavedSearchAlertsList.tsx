import { SavedSearchAlertsListQuery } from "__generated__/SavedSearchAlertsListQuery.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { graphql, QueryRenderer } from "react-relay"
import { SavedSearchAlertsListPlaceholder } from "./Components/SavedSearchAlertsListPlaceholder"
import { SavedSearchesListPaginationContainer } from "./Components/SavedSearchesList"
import { SortButton } from "./Components/SortButton"

interface Props {
  artistID: string
}
export const SavedSearchAlertsListQueryRenderer: React.FC<Props> = ({ artistID }) => {
  return (
    <QueryRenderer<SavedSearchAlertsListQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query SavedSearchAlertsListQuery($artistIDs: [String!]) {
          me {
            ...SavedSearchesList_me @arguments(artistIDs: $artistIDs)
          }
        }
      `}
      variables={{
        artistIDs: artistID ? [artistID] : [],
      }}
      cacheConfig={{ force: true }}
      render={renderWithPlaceholder({
        Container: SavedSearchesListPaginationContainer,
        renderPlaceholder: () => (
          <PageWithSimpleHeader title="Saved Alerts" right={<SortButton disabled />}>
            <SavedSearchAlertsListPlaceholder />
          </PageWithSimpleHeader>
        ),
        initialProps: {
          artistIDs: [artistID],
        },
      })}
    />
  )
}
