import { OwnerType } from "@artsy/cohesion"
import { VisualClueDot, VisualClueText } from "@artsy/palette-mobile"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ArtworkListsQR } from "app/Scenes/ArtworkLists/ArtworkLists"
import { FavoriteArtworksQueryRenderer } from "app/Scenes/Favorites/FavoriteArtworks"
import { MyCollectionBottomSheetModals } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import { MyCollectionQueryRenderer } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionInsightsQR } from "app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights"
import {
  MyCollectionTabsStore,
  MyCollectionTabsStoreProvider,
} from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { compact } from "lodash"
import { SafeAreaView } from "react-native-safe-area-context"
import { MyProfileHeaderQueryRenderer } from "./MyProfileHeader"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saves",
  insights = "Insights",
}

export const MyProfileHeaderMyCollectionAndSavedWorks: React.FC<{}> = ({}) => {
  const isArtworkListsEnabled = useFeatureFlag("AREnableArtworkLists")
  const viewKind = MyCollectionTabsStore.useStoreState((state) => state.viewKind)

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <StickyTabPage
          disableBackButtonUpdate
          lazyLoadTabs
          tabs={compact([
            {
              title: Tab.collection,
              content: <MyCollectionQueryRenderer />,
              initial: true,
            },
            {
              title: Tab.insights,
              content: <MyCollectionInsightsQR />,
              visualClues: [
                {
                  jsx: (
                    <VisualClueDot
                      style={{ marginLeft: 5, alignSelf: "flex-start", marginTop: 1 }}
                    />
                  ),
                  visualClueName: "AddedArtworkWithInsightsVisualClueDot",
                },
                {
                  jsx: <VisualClueText />,
                  visualClueName: "MyCollectionInsights",
                },
              ],
            },
            {
              title: Tab.savedWorks,
              content: isArtworkListsEnabled ? (
                <ArtworkListsQR />
              ) : (
                <FavoriteArtworksQueryRenderer />
              ),
            },
          ])}
          staticHeaderContent={<MyProfileHeaderQueryRenderer />}
        />
      </SafeAreaView>
      {viewKind !== null && <MyCollectionBottomSheetModals />}
    </>
  )
}

export const LOCAL_PROFILE_ICON_PATH_KEY = "LOCAL_PROFILE_ICON_PATH_KEY"

export const MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer: React.FC = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.profile })}
    >
      <MyCollectionTabsStoreProvider>
        <MyProfileHeaderMyCollectionAndSavedWorks />
      </MyCollectionTabsStoreProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
