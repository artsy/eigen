import { Screen } from "@artsy/palette-mobile"
import { SavedSearchAlertsListQuery } from "__generated__/SavedSearchAlertsListQuery.graphql"
import { goBack } from "app/system/navigation/navigate"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { SavedSearchAlertsListPlaceholder } from "./Components/SavedSearchAlertsListPlaceholder"
import { SavedSearchesListPaginationContainer } from "./Components/SavedSearchesList"
import { SortButton } from "./Components/SortButton"

const SavedSearchAlertsList: React.FC = () => {
  const data = useLazyLoadQuery<SavedSearchAlertsListQuery>(
    graphql`
      query SavedSearchAlertsListQuery {
        me {
          ...SavedSearchesList_me
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" }
  )
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return <SavedSearchesListPaginationContainer me={data.me!} />
}

const SavedSearchAlertsListPlaceholderWrapper: React.FC = () => {
  return (
    <Screen>
      <Screen.AnimatedHeader
        onBack={goBack}
        title="Alerts"
        rightElements={<SortButton disabled />}
      />

      <Screen.StickySubHeader title="Alerts" />

      <Screen.Body fullwidth>
        <SavedSearchAlertsListPlaceholder />
      </Screen.Body>
    </Screen>
  )
}

export const SavedSearchAlertsListQueryRenderer: React.FC = () => {
  return (
    <Suspense fallback={<SavedSearchAlertsListPlaceholderWrapper />}>
      <SavedSearchAlertsList />
    </Suspense>
  )
}
