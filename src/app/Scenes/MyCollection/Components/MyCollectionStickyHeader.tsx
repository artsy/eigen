import { ActionType, AddCollectedArtwork, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  AddIcon,
  Button,
  CloseIcon,
  Flex,
  Spacer,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { Pill } from "app/Components/Pill"
import { HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionArtworkUploadMessages } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkUploadMessages"
import {
  PurchasedArtworkAddedMessage,
  SubmittedArtworkAddedMessage,
} from "app/Scenes/MyCollection/Screens/Insights/MyCollectionMessages"
import {
  CollectedTab,
  MyCollectionTabsStore,
} from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate, popToRoot } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useMeasure } from "app/utils/hooks/useMeasure"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import { MotiView } from "moti"
import { useRef } from "react"
import { useTracking } from "react-tracking"

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
  showSeparator: boolean
}

export const MyCollectionStickyHeader: React.FC<MyCollectionStickyHeaderProps> = ({
  filtersCount,
  hasArtworks,
  hasMarketSignals,
  showModal,
  showNewWorksMessage,
  showSeparator,
}) => {
  const { showVisualClue } = useVisualClue()

  const showSubmissionMessage = showVisualClue("ArtworkSubmissionMessage")
  const enableCollectedArtists = useFeatureFlag("AREnableMyCollectionCollectedArtists")

  return (
    <>
      {enableCollectedArtists && (
        <Flex pb={0}>
          <MainStickyHeader hasArtworks={hasArtworks} />
        </Flex>
      )}
      {!!hasArtworks && (
        <Filters filtersCount={filtersCount} showModal={showModal} showSeparator={showSeparator} />
      )}
      <Messages
        showNewWorksMessage={showNewWorksMessage}
        showSubmissionMessage={showSubmissionMessage}
        hasMarketSignals={hasMarketSignals}
      />
    </>
  )
}

const MainStickyHeader: React.FC<{ hasArtworks: boolean }> = ({ hasArtworks }) => {
  const space = useSpace()
  const closeIconRef = useRef(null)

  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)
  const setSelectedTab = MyCollectionTabsStore.useStoreActions((actions) => actions.setSelectedTab)

  const { width } = useMeasure({ ref: closeIconRef })

  // X coordinate to which the pills will translate
  const originX = Number(width) + PILL_PADDING_IN_PX

  return (
    <>
      <Flex
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        style={{ paddingTop: space(2), paddingHorizontal: space(2) }}
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
        <Flex justifyContent="center" alignItems="center" flexDirection="row">
          <Touchable
            onPress={() => {
              console.log("Search button pressed")
            }}
            haptic
          >
            <SearchIcon width={24} height={24} />
          </Touchable>
          <Spacer x={PILL_PADDING} />
          <Touchable
            onPress={() => {
              console.log("Add button pressed")
            }}
            haptic
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

  const space = useSpace()

  return (
    <Flex
      left={space(2)}
      position="absolute"
      ref={closeIconRef}
      top={space(2)}
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
            setSelectedTab(null)
          }}
          haptic="impactLight"
        >
          <Flex
            alignItems="center"
            borderColor="black30"
            borderRadius={PILL_DIAMETER / 2}
            borderWidth="1px"
            height={PILL_DIAMETER}
            justifyContent="center"
            px={2}
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
        highlightEnabled
        onPress={() => {
          handlePress()
        }}
        rounded
        selected={selected}
      >
        {tab}
      </Pill>
    </MotiView>
  )
}

const Filters = ({
  filtersCount,
  showModal,
  showSeparator,
}: {
  filtersCount: number
  showModal: () => void
  showSeparator: boolean
}) => {
  const { trackEvent } = useTracking()

  return (
    <ArtworksFilterHeader
      selectedFiltersCount={filtersCount}
      onFilterPress={showModal}
      showSeparator={showSeparator}
    >
      <Button
        data-test-id="add-artwork-button-non-zero-state"
        haptic
        onPress={async () => {
          navigate("my-collection/artworks/new", {
            passProps: {
              mode: "add",
              source: Tab.collection,
              onSuccess: popToRoot,
            },
          })
          trackEvent(tracks.addCollectedArtwork())
        }}
        size="small"
        variant="fillDark"
      >
        Upload Artwork
      </Button>
    </ArtworksFilterHeader>
  )
}

const Messages: React.FC<{
  hasMarketSignals: boolean
  showNewWorksMessage: boolean
  showSubmissionMessage: boolean
}> = ({ hasMarketSignals, showNewWorksMessage, showSubmissionMessage }) => {
  return (
    <>
      {!!showNewWorksMessage && (
        <PurchasedArtworkAddedMessage
          onClose={() => AsyncStorage.setItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER, "true")}
        />
      )}
      {!!showSubmissionMessage && (
        <SubmittedArtworkAddedMessage
          onClose={() => setVisualClueAsSeen("ArtworkSubmissionMessage")}
        />
      )}
      <MyCollectionArtworkUploadMessages
        sourceTab={Tab.collection}
        hasMarketSignals={hasMarketSignals}
      />
    </>
  )
}

const tracks = {
  addCollectedArtwork: (): AddCollectedArtwork => ({
    action: ActionType.addCollectedArtwork,
    context_module: ContextModule.myCollectionHome,
    context_owner_type: OwnerType.myCollection,
    platform: "mobile",
  }),
}
