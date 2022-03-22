import { SavedSearchAlertsList_me } from "__generated__/SavedSearchAlertsList_me.graphql"
import { SavedSearchAlertsListQuery } from "__generated__/SavedSearchAlertsListQuery.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { SavedSearchAlertsListPlaceholder } from "./Components/SavedSearchAlertsListPlaceholder"
import { SavedSearchesListContainer as SavedSearchesList } from "./Components/SavedSearchesList"

interface SavedSearchAlertsListProps {
  me: SavedSearchAlertsList_me
}

export const SavedSearchAlertsList: React.FC<SavedSearchAlertsListProps> = (props) => {
  const { me } = props

  return (
    <PageWithSimpleHeader title="Saved Alerts">
      <SavedSearchesList me={me} />
    </PageWithSimpleHeader>
  )
}

export const SavedSearchAlertsListFragmentContainer = createFragmentContainer(
  SavedSearchAlertsList,
  {
    me: graphql`
      fragment SavedSearchAlertsList_me on Me {
        ...SavedSearchesList_me
      }
    `,
  }
)

export const SavedSearchAlertsListQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<SavedSearchAlertsListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SavedSearchAlertsListQuery {
          me {
            ...SavedSearchAlertsList_me
          }
        }
      `}
      variables={{}}
      cacheConfig={{ force: true }}
      render={renderWithPlaceholder({
        Container: SavedSearchAlertsListFragmentContainer,
        renderPlaceholder: () => (
          <PageWithSimpleHeader title="Saved Alerts">
            <SavedSearchAlertsListPlaceholder />
          </PageWithSimpleHeader>
        ),
      })}
    />
  )
}
