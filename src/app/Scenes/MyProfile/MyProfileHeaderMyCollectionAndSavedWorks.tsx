import { OwnerType } from "@artsy/cohesion"
import { Screen, Tabs, VisualClueDot } from "@artsy/palette-mobile"
import { ArtworkListsQR } from "app/Scenes/ArtworkLists/ArtworkLists"
import { MyCollectionBottomSheetModals } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import { MyCollectionQueryRenderer } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionInsightsQR } from "app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights"
import {
  MyCollectionTabsStore,
  MyCollectionTabsStoreProvider,
} from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { MyProfileHeaderQueryRenderer } from "app/Scenes/MyProfile/MyProfileHeader"
import { GlobalStore } from "app/store/GlobalStore"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useMemo } from "react"

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
  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const viewKind = MyCollectionTabsStore.useStoreState((state) => state.viewKind)
  const { showVisualClue } = useVisualClue()

  // Check if there's new content
  const indicators = []
  if (showVisualClue("MyCollectionInsights")) {
    indicators.push({
      tabName: Tab.insights,
      Component: () => {
        return <VisualClueDot style={{ left: -29, alignSelf: "flex-end", marginTop: 15 }} />
      },
    })
  }
  // if the progress of saved artwork onboarding reached the final stage of the chain we show the dot
  // if (isDismissed("find-saved-artwork").status && !isDismissed("save-highlight").status) {
  //   indicators.push({
  //     tabName: Tab.savedWorks,
  //     Component: () => {
  //       return <VisualClueDot style={{ left: -29, alignSelf: "flex-end", marginTop: 15 }} />
  //     },
  //   })
  // }

  return (
    <>
      <Screen>
        <Screen.Body fullwidth>
          <Tabs
            initialTabName={initialTab}
            renderHeader={() => <MyProfileHeaderQueryRenderer />}
            headerHeight={500}
            indicators={indicators}
            onTabPress={(tabName) => {
              if (tabName === Tab.insights) {
                setVisualClueAsSeen("MyCollectionInsights")
              }
            }}
            // FYI: We're disabling horizontal scroll between Profile tabs as it
            // conflicts with the horizontal scroll of the Artists rail within
            // the My Collection tab.
            pagerProps={{
              scrollEnabled: false,
            }}
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
            {/* <Tabs.Tab name={Tab.savedWorks} label={Tab.savedWorks}>
              <Tabs.Lazy>
                <ArtworkListsQR />
              </Tabs.Lazy>
            </Tabs.Tab> */}
          </Tabs>
        </Screen.Body>
      </Screen>
      {viewKind !== null && <MyCollectionBottomSheetModals />}
    </>
  )
}

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
