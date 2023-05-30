import { OwnerType } from "@artsy/cohesion"
import { Screen } from "@artsy/palette-mobile"
import { MyProfileHeaderMyCollectionAndSavedWorksQuery } from "__generated__/MyProfileHeaderMyCollectionAndSavedWorksQuery.graphql"
import { MyProfileHeaderMyCollectionAndSavedWorks_me$data } from "__generated__/MyProfileHeaderMyCollectionAndSavedWorks_me.graphql"
import { useCheckIfArtworkListsEnabled } from "app/Components/ArtworkLists/useCheckIfArtworkListsEnabled"
import { TabsContainer } from "app/Components/Tabs/TabsContainer"
import { ArtworkListsQR } from "app/Scenes/ArtworkLists/ArtworkLists"
import { FavoriteArtworksQueryRenderer } from "app/Scenes/Favorites/FavoriteArtworks"
import { MyCollectionBottomSheetModals } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import {
  MyCollectionPlaceholder,
  MyCollectionQueryRenderer,
} from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionInsightsQR } from "app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights"
import {
  MyCollectionTabsStore,
  MyCollectionTabsStoreProvider,
} from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Tabs } from "react-native-collapsible-tab-view"
import { SafeAreaView } from "react-native-safe-area-context"
import { QueryRenderer, createRefetchContainer } from "react-relay"
import { graphql } from "relay-runtime"
import { MyProfileHeader } from "./MyProfileHeader"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saves",
  insights = "Insights",
}

export const MyProfileHeaderMyCollectionAndSavedWorks: React.FC<{
  me: MyProfileHeaderMyCollectionAndSavedWorks_me$data
}> = ({ me }) => {
  const isArtworkListsEnabled = useCheckIfArtworkListsEnabled()
  const viewKind = MyCollectionTabsStore.useStoreState((state) => state.viewKind)

  return (
    <Screen>
      <TabsContainer
        lazy
        initialTabName={Tab.collection}
        renderHeader={() => <MyProfileHeader me={me} />}
      >
        <Tabs.Tab name={Tab.collection} label={Tab.collection}>
          <Tabs.Lazy>
            <MyCollectionQueryRenderer />
          </Tabs.Lazy>
        </Tabs.Tab>
        {/* TODO: need to implement visual clue dot here see diff */}
        <Tabs.Tab name={Tab.insights} label={Tab.insights}>
          <Tabs.Lazy>
            <MyCollectionInsightsQR />
          </Tabs.Lazy>
        </Tabs.Tab>
        <Tabs.Tab name={Tab.savedWorks} label={Tab.savedWorks}>
          <Tabs.Lazy>
            {isArtworkListsEnabled ? <ArtworkListsQR /> : <FavoriteArtworksQueryRenderer />}
          </Tabs.Lazy>
        </Tabs.Tab>
      </TabsContainer>
      {viewKind !== null && <MyCollectionBottomSheetModals />}
    </Screen>
  )
}

export const LOCAL_PROFILE_ICON_PATH_KEY = "LOCAL_PROFILE_ICON_PATH_KEY"

export const MyProfileHeaderMyCollectionAndSavedWorksFragmentContainer = createRefetchContainer(
  MyProfileHeaderMyCollectionAndSavedWorks,
  {
    me: graphql`
      fragment MyProfileHeaderMyCollectionAndSavedWorks_me on Me {
        ...MyProfileHeader_me
        ...AuctionResultsForArtistsYouCollectRail_me
      }
    `,
  },
  graphql`
    query MyProfileHeaderMyCollectionAndSavedWorksRefetchQuery {
      me {
        ...MyProfileHeaderMyCollectionAndSavedWorks_me
      }
    }
  `
)

export const MyProfileHeaderMyCollectionAndSavedWorksScreenQuery = graphql`
  query MyProfileHeaderMyCollectionAndSavedWorksQuery {
    me @optionalField {
      ...MyProfileHeaderMyCollectionAndSavedWorks_me
    }
  }
`

export const MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer: React.FC = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.profile })}
    >
      <MyCollectionTabsStoreProvider>
        <QueryRenderer<MyProfileHeaderMyCollectionAndSavedWorksQuery>
          environment={getRelayEnvironment()}
          query={MyProfileHeaderMyCollectionAndSavedWorksScreenQuery}
          render={renderWithPlaceholder({
            Container: MyProfileHeaderMyCollectionAndSavedWorksFragmentContainer,
            renderPlaceholder: () => (
              <SafeAreaView>
                <MyCollectionPlaceholder />
              </SafeAreaView>
            ),
          })}
          variables={{}}
        />
      </MyCollectionTabsStoreProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
