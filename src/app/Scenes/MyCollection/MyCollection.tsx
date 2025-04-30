import { AddIcon, FilterIcon, MoreIcon } from "@artsy/icons/native"
import { Flex, Screen, Tabs, Text, Touchable, VisualClueDot } from "@artsy/palette-mobile"
import { ACCESSIBLE_DEFAULT_ICON_SIZE, ICON_HIT_SLOP } from "app/Components/constants"
import { MyCollectionBottomSheetModals } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import { MyCollectionCollectedArtistsQueryRenderer } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtists"
import { MyCollectionArtworksQueryRenderer } from "app/Scenes/MyCollection/MyCollectionArtworks"
import {
  MyCollectionNavigationTab,
  MyCollectionTabsStore,
  MyCollectionTabsStoreProvider,
} from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { PixelRatio } from "react-native"
import { MyCollectionQueryRenderer as MyCollectionLegacyQueryRenderer } from "./MyCollectionLegacy"

// TODO: To be replace with the real collector profile card
const MyCollectionCollectorProfileHeader = () => {
  return (
    <Flex
      backgroundColor="mono5"
      height={200}
      justifyContent="center"
      alignItems="center"
      m={2}
      borderRadius={20}
    >
      <Text variant="lg-display" textAlign="center">
        Profile Header
      </Text>
    </Flex>
  )
}

export enum Tab {
  artworks = "Artworks",
  artists = "Artists",
  insights = "Insights",
}

const DOT_DIAMETER = 6 * PixelRatio.getFontScale()

const MyCollection: React.FC = () => {
  const viewKind = MyCollectionTabsStore.useStoreState((state) => state.viewKind)
  const { setActiveNavigationTab, setIsFilterModalVisible } = MyCollectionTabsStore.useStoreActions(
    (actions) => actions
  )
  const { activeNavigationTab, filtersCount } = MyCollectionTabsStore.useStoreState(
    (state) => state
  )
  return (
    <>
      <Screen>
        <Screen.Header
          onBack={goBack}
          rightElements={
            <Touchable hitSlop={ICON_HIT_SLOP} onPress={() => {}}>
              <MoreIcon fill="mono100" />
            </Touchable>
          }
        />
        <Screen.Body fullwidth>
          <Tabs
            renderHeader={MyCollectionCollectorProfileHeader}
            headerHeight={500}
            pagerProps={{
              scrollEnabled: false,
            }}
            onTabPress={(tab) => {
              setActiveNavigationTab(tab as MyCollectionNavigationTab)
            }}
            stickyTabBarComponent={
              <Flex flexDirection="row" alignItems="center" gap={1} pr={2}>
                {/* Filtering is only available for artworks */}
                {activeNavigationTab === "Artworks" && (
                  <Touchable
                    hitSlop={ICON_HIT_SLOP}
                    onPress={() => {
                      setIsFilterModalVisible(true)
                    }}
                  >
                    {!!filtersCount && (
                      <Flex position="absolute" right={0} top={0}>
                        <VisualClueDot diameter={DOT_DIAMETER} />
                      </Flex>
                    )}

                    <FilterIcon
                      height={ACCESSIBLE_DEFAULT_ICON_SIZE}
                      width={ACCESSIBLE_DEFAULT_ICON_SIZE}
                    />
                  </Touchable>
                )}

                <Touchable hitSlop={ICON_HIT_SLOP} onPress={() => {}}>
                  <AddIcon
                    height={ACCESSIBLE_DEFAULT_ICON_SIZE}
                    width={ACCESSIBLE_DEFAULT_ICON_SIZE}
                  />
                </Touchable>
              </Flex>
            }
            variant="pills"
          >
            <Tabs.Tab name={Tab.artworks} label={Tab.artworks}>
              <MyCollectionArtworksQueryRenderer />
            </Tabs.Tab>

            <Tabs.Tab name={Tab.artists} label={Tab.artists}>
              <Tabs.ScrollView>
                <MyCollectionCollectedArtistsQueryRenderer />
              </Tabs.ScrollView>
            </Tabs.Tab>

            <Tabs.Tab name={Tab.insights} label={Tab.insights}>
              <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="green10">
                <Text>Insights</Text>
              </Flex>
            </Tabs.Tab>
          </Tabs>
        </Screen.Body>
      </Screen>
      {viewKind !== null && <MyCollectionBottomSheetModals />}
    </>
  )
}

export const MyCollectionQueryRenderer: React.FC = () => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  if (enableRedesignedSettings) {
    return (
      <MyCollectionTabsStoreProvider>
        <MyCollection />
      </MyCollectionTabsStoreProvider>
    )
  }

  return <MyCollectionLegacyQueryRenderer />
}
