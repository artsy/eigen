import { Flex } from "@artsy/palette-mobile"
import { SavedSearchAlertsListQuery } from "__generated__/SavedSearchAlertsListQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { graphql, QueryRenderer } from "react-relay"
import { SavedSearchAlertsListPlaceholder } from "./Components/SavedSearchAlertsListPlaceholder"
import { SavedSearchesListPaginationContainer } from "./Components/SavedSearchesList"
import { SortButton } from "./Components/SortButton"

export const SavedSearchAlertsListQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<SavedSearchAlertsListQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query SavedSearchAlertsListQuery {
          me {
            ...SavedSearchesList_me
          }
        }
      `}
      variables={{}}
      cacheConfig={{ force: true }}
      render={renderWithPlaceholder({
        Container: SavedSearchesListPaginationContainer,
        renderPlaceholder: () => (
          <Flex>
            <FancyModalHeader
              hideBottomDivider
              onLeftButtonPress={goBack}
              onRightButtonPress={() => {}}
              renderRightButton={() => <SortButton disabled />}
            >
              Alerts
            </FancyModalHeader>
            <SavedSearchAlertsListPlaceholder />
          </Flex>
        ),
      })}
    />
  )
}
