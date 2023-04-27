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
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate, popToRoot } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useMeasure } from "app/utils/hooks/useMeasure"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import { MotiView } from "moti"
import { useRef, useState } from "react"
import { useTracking } from "react-tracking"

interface MyCollectionStickyHeaderProps {
  filtersCount: number
  hasMarketSignals: boolean
  showModal: () => void
  showNewWorksMessage: boolean
  showSeparator: boolean
}

type CollectedTab = "Artworks" | "Artists" | null

export const MyCollectionStickyHeader: React.FC<MyCollectionStickyHeaderProps> = ({
  showModal,
  showSeparator,
  hasMarketSignals,
  showNewWorksMessage,
  filtersCount,
}) => {
  const { showVisualClue } = useVisualClue()
  const [selectedTab, setSelectedTab] = useState<CollectedTab>(null)
  const showSubmissionMessage = showVisualClue("ArtworkSubmissionMessage")
  const enableCollectedArtists = useFeatureFlag("AREnableMyCollectionCollectedArtists")

  const showFilters = true
  return (
    <Flex>
      {enableCollectedArtists && (
        <Flex pb={showFilters ? 0 : 2}>
          <MainStickyHeader selectedTab={selectedTab} onTabChange={setSelectedTab} />
        </Flex>
      )}

      {showFilters && (
        <Filters filtersCount={filtersCount} showModal={showModal} showSeparator={showSeparator} />
      )}

      <Messages
        showNewWorksMessage={showNewWorksMessage}
        showSubmissionMessage={showSubmissionMessage}
        hasMarketSignals={hasMarketSignals}
      />
    </Flex>
  )
}

interface MainStickyHeaderProps {
  selectedTab: CollectedTab
  onTabChange: (tab: CollectedTab) => void
}

const PILL_DIAMETER = 30

const PILL_PADDING = 1
const PILL_PADDING_IN_PX = 10

const MainStickyHeader: React.FC<MainStickyHeaderProps> = ({ selectedTab, onTabChange }) => {
  const space = useSpace()
  const closeIconRef = useRef(null)

  const { width } = useMeasure({ ref: closeIconRef })

  // X coordinate to which the pills will translate
  const originX = Number(width) + PILL_PADDING_IN_PX

  return (
    <>
      <Flex
        flexDirection="row"
        style={{ paddingTop: space(2), paddingHorizontal: space(2) }}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Pills */}

        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <AnimatedPill
            tab="Artists"
            selectedTab={selectedTab}
            handlePress={() => onTabChange("Artists")}
            originX={originX}
          />
          <Spacer x={PILL_PADDING} />
          <AnimatedPill
            tab="Artworks"
            selectedTab={selectedTab}
            handlePress={() => onTabChange("Artworks")}
            originX={originX}
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
            <SearchIcon width={18} height={24} />
          </Touchable>
          <Spacer x={PILL_PADDING} />
          <Touchable
            onPress={() => {
              console.log("Add button pressed")
            }}
            haptic
          >
            <AddIcon width={18} height={24} />
          </Touchable>
        </Flex>
      </Flex>

      <AnimatedCloseIcon
        selectedTab={selectedTab}
        closeIconRef={closeIconRef}
        onTabChange={onTabChange}
      />
    </>
  )
}

const AnimatedCloseIcon = ({
  selectedTab,
  closeIconRef,
  onTabChange,
}: {
  selectedTab: CollectedTab
  closeIconRef: React.RefObject<any>
  onTabChange: (tab: CollectedTab) => void
}) => {
  const space = useSpace()

  return (
    <Flex
      position="absolute"
      top={space(2)}
      left={space(2)}
      // Allow the first pill to capture touches when the X button is hidden
      zIndex={selectedTab !== null ? 1 : -1}
      ref={closeIconRef}
    >
      <MotiView
        animate={{
          opacity: selectedTab !== null ? 1 : 0,
        }}
        delay={selectedTab !== null ? 200 : 0}
      >
        <Touchable
          onPress={() => {
            onTabChange(null)
          }}
          haptic="impactLight"
        >
          <Flex
            height={PILL_DIAMETER}
            borderWidth="1px"
            borderColor="black30"
            width={PILL_DIAMETER}
            borderRadius={PILL_DIAMETER / 2}
            px={2}
            justifyContent="center"
            alignItems="center"
          >
            <CloseIcon />
          </Flex>
        </Touchable>
      </MotiView>
    </Flex>
  )
}

const AnimatedPill = ({
  selectedTab,
  tab,
  handlePress,
  originX,
}: {
  selectedTab: CollectedTab
  tab: CollectedTab
  handlePress: () => void
  originX: number | undefined
}) => {
  const containerRef = useRef(null)
  const space = useSpace()

  const { pageX: xPositionInPage } = useMeasure({ ref: containerRef })

  const getTranslateX = () => {
    if (selectedTab === null || xPositionInPage === undefined) {
      return 0
    }

    return Number(originX) - xPositionInPage + space(2)
  }

  return (
    <MotiView
      animate={{
        translateX: getTranslateX(),
        opacity: selectedTab === tab || selectedTab === null ? 1 : 0,
      }}
      transition={{
        type: "timing",
      }}
      ref={containerRef}
    >
      <Pill
        highlightEnabled
        onPress={() => {
          handlePress()
        }}
        selected={selectedTab === tab}
        rounded
        disabled={!!selectedTab && selectedTab !== tab}
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
        size="small"
        variant="fillDark"
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
        haptic
      >
        Upload Artwork
      </Button>
    </ArtworksFilterHeader>
  )
}

const Messages = ({
  showNewWorksMessage,
  showSubmissionMessage,
  hasMarketSignals,
}: {
  showNewWorksMessage: boolean
  showSubmissionMessage: boolean
  hasMarketSignals: boolean
}) => {
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
