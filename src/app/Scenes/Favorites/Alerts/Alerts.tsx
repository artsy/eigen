import { AlertsQuery } from "__generated__/AlertsQuery.graphql"
import { AlertsListPaginationContainer } from "app/Scenes/Favorites/Alerts/AlertsList"
import { AlertsListPlaceholder } from "app/Scenes/Favorites/Alerts/AlertsListPlaceholder"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { graphql, QueryRenderer } from "react-relay"

export const AlertsQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<AlertsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query AlertsQuery {
          me {
            ...AlertsList_me
          }
        }
      `}
      variables={{}}
      render={renderWithPlaceholder({
        Container: AlertsListPaginationContainer,
        renderPlaceholder: () => <AlertsListPlaceholder />,
      })}
    />
  )
}
