import { SavedSearchAlertsList_me } from "__generated__/SavedSearchAlertsList_me.graphql"
import { SavedSearchAlertsListQuery } from "__generated__/SavedSearchAlertsListQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { SavedSearchAlertsListPlaceholder } from './Components/SavedSearchAlertsListPlaceholder'
import { SavedSearchesContainer as SavedSearches } from "./Components/SavedSearches"

interface SavedSearchAlertsListProps {
  me: SavedSearchAlertsList_me
}

export const SavedSearchAlertsList: React.FC<SavedSearchAlertsListProps> = (props) => {
  const { me } = props

  return (
    <PageWithSimpleHeader title="Saved Alerts">
      <SavedSearches me={me} />
    </PageWithSimpleHeader>
  )
}

export const SavedSearchAlertsListFragmentContainer = createFragmentContainer(SavedSearchAlertsList, {
  me: graphql`
    fragment SavedSearchAlertsList_me on Me {
      ...SavedSearches_me
    }
  `
})

export const SavedSearchAlertsListQueryRenderer: React.FC<{}> = () => {
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
        renderPlaceholder: () => <SavedSearchAlertsListPlaceholder />,
      })}
    />
  )
}
