import { OwnerType } from "@artsy/cohesion"
import { Tabs, VisualClueDot, VisualClueText } from "@artsy/palette-mobile"
import { TabsContainer } from "@artsy/palette-mobile/dist/elements/Tabs/TabsContainer"
import { useCheckIfArtworkListsEnabled } from "app/Components/ArtworkLists/useCheckIfArtworkListsEnabled"
import { TabProps } from "app/Components/StickyTabPage/StickyTabPage"
import { ArtworkListsQR } from "app/Scenes/ArtworkLists/ArtworkLists"
import { FavoriteArtworksQueryRenderer } from "app/Scenes/Favorites/FavoriteArtworks"
import { MyCollectionBottomSheetModals } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import { MyCollectionQueryRenderer } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionInsightsQR } from "app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights"
import {
  MyCollectionTabsStore,
  MyCollectionTabsStoreProvider,
} from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { MyProfileHeaderQueryRenderer } from "app/Scenes/MyProfile/MyProfileHeader"
import { GlobalStore } from "app/store/GlobalStore"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { compact } from "lodash"
import { useMemo } from "react"
import { SafeAreaView } from "react-native-safe-area-context"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saves",
  insights = "Insights",
}

interface Props {
  initialTab: Tab
}

interface MyProfileTabProps {
  initialTab?: Tab
}

export const MyProfileHeaderMyCollectionAndSavedWorks: React.FC<Props> = ({ initialTab }) => {
  const isArtworkListsEnabled = useCheckIfArtworkListsEnabled()
  const viewKind = MyCollectionTabsStore.useStoreState((state) => state.viewKind)
  const tabs: TabProps[] = compact([
    {
      title: Tab.collection,
      content: <MyCollectionQueryRenderer />,
    },
    {
      title: Tab.insights,
      content: <MyCollectionInsightsQR />,
      visualClues: [
        {
          jsx: <VisualClueDot style={{ marginLeft: 5, alignSelf: "flex-start", marginTop: 1 }} />,
          visualClueName: "AddedArtworkWithInsightsVisualClueDot",
        },
        {
          jsx: <VisualClueText />,
          visualClueName: "MyCollectionInsights",
        },
      ],
    },
  ])

  tabs.forEach((tab) => {
    tab.initial = tab.title === initialTab
  })

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <TabsContainer
          initialTabName={initialTab}
          renderHeader={() => <MyProfileHeaderQueryRenderer />}
        >
          <Tabs.Tab name={Tab.collection} label={Tab.collection}>
            <Tabs.Lazy>
              <MyCollectionQueryRenderer />
            </Tabs.Lazy>
          </Tabs.Tab>
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
      </SafeAreaView>
      {viewKind !== null && <MyCollectionBottomSheetModals />}
    </>
  )
}

export const LOCAL_PROFILE_ICON_PATH_KEY = "LOCAL_PROFILE_ICON_PATH_KEY"

export const MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer: React.FC = () => {
  const tabProps = useMyProfileTabProps()
  const key = useMemo(() => `${Date.now()}`, [tabProps])
  const initialTab = tabProps?.initialTab ?? Tab.collection

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.profile })}
      key={key}
    >
      <MyCollectionTabsStoreProvider>
        <MyProfileHeaderMyCollectionAndSavedWorks initialTab={initialTab} />
      </MyCollectionTabsStoreProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const useMyProfileTabProps = () => {
  const tabProps = GlobalStore.useAppState((state) => {
    return state.bottomTabs.sessionState.tabProps.profile
  })

  return tabProps as MyProfileTabProps | undefined
}
