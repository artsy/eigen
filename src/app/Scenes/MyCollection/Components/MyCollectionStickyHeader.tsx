import { AddIcon, CloseIcon } from "@artsy/icons/native"
import { Flex, Pill, Spacer, Touchable, useSpace } from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MyCollectionArtworkFilters } from "app/Scenes/MyCollection/Components/MyCollectionArtworkFiltersStickyTab"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER } from "app/Scenes/MyCollection/MyCollectionLegacy"
import { MyCollectionArtworkUploadMessages } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkUploadMessages"
import { PurchasedArtworkAddedMessage } from "app/Scenes/MyCollection/Screens/Insights/MyCollectionMessages"
import {
  CollectedTab,
  MyCollectionTabsStore,
} from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate } from "app/system/navigation/navigate"
import { useMeasure } from "app/utils/hooks/useMeasure"
import { debounce } from "lodash"
import { MotiView } from "moti"
import { useMemo, useRef } from "react"

// CONSTANTS
const PILL_DIAMETER = 30
const PILL_PADDING = 1
const PILL_PADDING_IN_PX = 10

interface MyCollectionStickyHeaderProps {
  filtersCount: number
  hasArtworks: boolean
  hasMarketSignals: boolean
  showModal: () => void
  showNewWorksMessage: boolean
}

export const MyCollectionStickyHeader: React.FC<MyCollectionStickyHeaderProps> = ({
  filtersCount,
  hasArtworks,
  hasMarketSignals,
  showModal,
  showNewWorksMessage,
}) => {
  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)

  const showArtworkFilters = useMemo(() => {
    return selectedTab === "Artworks"
  }, [selectedTab, hasArtworks])

  return (
    <Flex px={2} backgroundColor="background">
      <Messages showNewWorksMessage={showNewWorksMessage} hasMarketSignals={hasMarketSignals} />

      <MainStickyHeader hasArtworks={hasArtworks} />

      {!!showArtworkFilters && (
        <MyCollectionArtworkFilters filtersCount={filtersCount} showModal={showModal} />
      )}
    </Flex>
  )
}

export const MainStickyHeader: React.FC<{ hasArtworks: boolean }> = ({ hasArtworks }) => {
  const closeIconRef = useRef(null)

  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)

  const setSelectedTab = MyCollectionTabsStore.useStoreActions((actions) => actions.setSelectedTab)
  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)

  const showAddToMyCollectionBottomSheet = debounce(() => {
    setViewKind({ viewKind: "Add" })
  }, 100)

  const handleCreateButtonPress = () => {
    switch (selectedTab) {
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

  const { width } = useMeasure({ ref: closeIconRef })

  // X coordinate to which the pills will translate
  const originX = Number(width) + PILL_PADDING_IN_PX

  return (
    <>
      <Flex
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        p={2}
        position="relative"
      >
        <AnimatedCloseIcon closeIconRef={closeIconRef} />

        {/* Pills */}
        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <AnimatedPill
            handlePress={() => setSelectedTab("Artists")}
            originX={originX}
            selectedTab={selectedTab}
            tab="Artists"
          />

          <Spacer x={PILL_PADDING} />

          <AnimatedPill
            handlePress={() => setSelectedTab("Artworks")}
            originX={originX}
            selectedTab={selectedTab}
            tab="Artworks"
            disabled={!hasArtworks}
          />
        </Flex>

        {/* Seach and Add */}
        <Flex flexDirection="row">
          <Touchable
            onPress={() => {
              handleCreateButtonPress()
            }}
            haptic
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AddIcon width={24} height={24} />
          </Touchable>
        </Flex>
      </Flex>
    </>
  )
}

const AnimatedCloseIcon: React.FC<{
  closeIconRef: React.RefObject<any>
}> = ({ closeIconRef }) => {
  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)
  const setSelectedTab = MyCollectionTabsStore.useStoreActions((actions) => actions.setSelectedTab)
  const setKeyword = debounce(
    MyCollectionArtworksKeywordStore.useStoreActions((actions) => actions.setKeyword)
  )

  const space = useSpace()

  return (
    <Flex
      left={space(2)}
      position="absolute"
      ref={closeIconRef}
      // Allow the first pill to capture touches when the X button is hidden
      zIndex={selectedTab !== null ? 1 : -1}
    >
      <MotiView
        animate={{
          opacity: selectedTab !== null ? 1 : 0,
        }}
        delay={selectedTab !== null ? 300 : 0}
      >
        <Touchable
          onPress={() => {
            setKeyword("")
            setSelectedTab(null)
          }}
          haptic="impactLight"
        >
          <Flex
            alignItems="center"
            borderColor="mono30"
            borderRadius={PILL_DIAMETER / 2}
            borderWidth="1px"
            height={PILL_DIAMETER}
            justifyContent="center"
            width={PILL_DIAMETER}
          >
            <CloseIcon />
          </Flex>
        </Touchable>
      </MotiView>
    </Flex>
  )
}

const AnimatedPill: React.FC<{
  disabled?: boolean
  handlePress: () => void
  originX: number | undefined
  selectedTab: CollectedTab
  tab: CollectedTab
}> = ({ disabled: disabledProp, handlePress, originX, selectedTab, tab }) => {
  const containerRef = useRef(null)
  const space = useSpace()

  const { pageX: xPositionInPage } = useMeasure({ ref: containerRef })

  const getTranslateX = () => {
    if (selectedTab === null || xPositionInPage === undefined) {
      return 0
    }
    if (selectedTab !== tab) {
      return undefined
    }

    return Number(originX) - xPositionInPage + space(2)
  }

  const selected = selectedTab === tab
  const disabled = (!!selectedTab && selectedTab !== tab) || disabledProp

  return (
    <MotiView
      animate={{
        translateX: getTranslateX(),
        opacity: selectedTab === tab || selectedTab === null ? 1 : 0,
      }}
      ref={containerRef}
      transition={{
        type: "timing",
        translateX: {
          // Only show the pill after they are nrro longer overlapping
          delay: selectedTab === null ? 0 : 200,
        },
        opacity: {
          // Only show the pill after they are no longer overlapping
          delay: selectedTab === null ? 200 : 0,
        },
      }}
    >
      <Pill
        accessibilityState={{ selected, disabled }}
        disabled={disabled}
        onPress={() => {
          handlePress()
        }}
        selected={selected}
      >
        {tab}
      </Pill>
    </MotiView>
  )
}

const Messages: React.FC<{
  hasMarketSignals: boolean
  showNewWorksMessage: boolean
}> = ({ hasMarketSignals, showNewWorksMessage }) => {
  if (!hasMarketSignals && !showNewWorksMessage) {
    return null
  }

  return (
    <Flex>
      {!!showNewWorksMessage && (
        <PurchasedArtworkAddedMessage
          onClose={() => AsyncStorage.setItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER, "true")}
        />
      )}
      <MyCollectionArtworkUploadMessages
        sourceTab={Tab.collection}
        hasMarketSignals={hasMarketSignals}
      />
    </Flex>
  )
}
