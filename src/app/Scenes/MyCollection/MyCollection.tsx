import { OwnerType } from "@artsy/cohesion"
import { AddIcon, MoreIcon } from "@artsy/icons/native"
import { Flex, Screen, Tabs, Touchable, useColor } from "@artsy/palette-mobile"
import { ACCESSIBLE_DEFAULT_ICON_SIZE, ICON_HIT_SLOP } from "app/Components/constants"
import { MyCollectionBottomSheetModals } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import {
  myCollectionCollectedArtistsQuery,
  MyCollectionCollectedArtistsQueryRenderer,
} from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtists"
import {
  MyCollectionInsightsQR,
  MyCollectionInsightsScreenQuery,
} from "app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights"
import { UserAccountHeaderQueryRenderer } from "app/Scenes/MyProfile/Components/UserAccountHeader/UserAccountHeader"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { prefetchQuery } from "app/utils/queryPrefetching"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { debounce } from "lodash"
import { useEffect } from "react"
import { MyCollectionArtworksQueryRenderer } from "./MyCollectionArtworks"
import { MyCollectionListingsQueryRenderer } from "./MyCollectionListings"
import {
  MyCollectionNavigationTab,
  MyCollectionTabsStore,
  MyCollectionTabsStoreProvider,
} from "./State/MyCollectionTabsStore"

export enum Tab {
  artworks = "Artworks",
  artists = "Artists",
  insights = "Insights",
  collection = "My Collection",
  listings = "Listings",
}

const MyCollection: React.FC = () => {
  const color = useColor()
  const enableShowSellArtwork = useFeatureFlag("AREnableSellMyCollectionArtwork")

  const viewKind = MyCollectionTabsStore.useStoreState((state) => state.viewKind)
  const { setActiveNavigationTab, setViewKind } = MyCollectionTabsStore.useStoreActions(
    (actions) => actions
  )
  const { activeNavigationTab } = MyCollectionTabsStore.useStoreState((state) => state)

  useEffect(() => {
    if (!enableShowSellArtwork) {
      prefetchQuery({ query: myCollectionCollectedArtistsQuery })
    }
    prefetchQuery({ query: MyCollectionInsightsScreenQuery })
  }, [enableShowSellArtwork])

  const showAddToMyCollectionBottomSheet = debounce(() => {
    setViewKind({ viewKind: "Add" })
  }, 100)

  const handleCreateButtonPress = () => {
    switch (activeNavigationTab) {
      case "Artists":
        navigate("my-collection/collected-artists/new")
        break
      case "Artworks":
        navigate("my-collection/artworks/new", {
          passProps: {
            source: Tab.collection,
          },
        })
        break
      default:
        showAddToMyCollectionBottomSheet()
        break
    }
  }

  return (
    <>
      <Screen>
        <Screen.Header
          onBack={goBack}
          rightElements={
            <Touchable
              accessibilityRole="button"
              hitSlop={ICON_HIT_SLOP}
              onPress={() => {
                setViewKind({ viewKind: "Profile" })
              }}
            >
              <MoreIcon fill="mono100" />
            </Touchable>
          }
        />
        <Screen.Body fullwidth>
          <Tabs
            renderHeader={() => <UserAccountHeaderQueryRenderer />}
            // Wraps the header and the sticky tab bar, so this draws a border under the tab bar
            // that applies to every tab. Passing it replaces palette's default container style,
            // so that is repeated here. Even an undefined value would replace the default, so the
            // prop is only passed when the flag is on.
            {...(enableShowSellArtwork && {
              headerContainerStyle: {
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
                backgroundColor: color("background"),
                borderBottomWidth: 1,
                borderBottomColor: color("mono10"),
              },
            })}
            headerHeight={500}
            pagerProps={{
              scrollEnabled: false,
            }}
            onTabPress={(tab) => {
              setActiveNavigationTab(tab as MyCollectionNavigationTab)
            }}
            stickyTabBarComponent={
              enableShowSellArtwork ? null : (
                <Flex flexDirection="row" alignItems="center" gap={2} mr={2}>
                  {activeNavigationTab !== Tab.insights && (
                    <Touchable
                      accessibilityRole="button"
                      hitSlop={ICON_HIT_SLOP}
                      onPress={() => handleCreateButtonPress()}
                    >
                      <AddIcon
                        height={ACCESSIBLE_DEFAULT_ICON_SIZE}
                        width={ACCESSIBLE_DEFAULT_ICON_SIZE}
                      />
                    </Touchable>
                  )}
                </Flex>
              )
            }
            variant={enableShowSellArtwork ? "tabs" : "pills"}
          >
            <Tabs.Tab name={Tab.artworks} label={Tab.artworks}>
              <MyCollectionArtworksQueryRenderer />
            </Tabs.Tab>

            {!enableShowSellArtwork ? (
              <Tabs.Tab name={Tab.artists} label={Tab.artists}>
                <MyCollectionCollectedArtistsQueryRenderer />
              </Tabs.Tab>
            ) : null}

            <Tabs.Tab name={Tab.insights} label={Tab.insights}>
              <MyCollectionInsightsQR />
            </Tabs.Tab>

            {enableShowSellArtwork ? (
              <Tabs.Tab name={Tab.listings} label={Tab.listings}>
                <MyCollectionListingsQueryRenderer />
              </Tabs.Tab>
            ) : null}
          </Tabs>
        </Screen.Body>
      </Screen>
      {viewKind !== null && <MyCollectionBottomSheetModals />}
    </>
  )
}

export const MyCollectionQueryRenderer: React.FC = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.myCollection,
      })}
    >
      <MyCollectionTabsStoreProvider>
        <MyCollection />
      </MyCollectionTabsStoreProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
