import { ActionType, AddCollectedArtwork, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  AddIcon,
  Button,
  CloseIcon,
  FilterIcon,
  Flex,
  Input,
  Spacer,
  Text,
  Touchable,
  TouchableHighlightColor,
  bullet,
  useSpace,
} from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { Pill } from "app/Components/Pill"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
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
import { debounce } from "lodash"
import { MotiView } from "moti"
import { useEffect, useMemo, useRef, useState } from "react"
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
}

export const MyCollectionStickyHeader: React.FC<MyCollectionStickyHeaderProps> = ({
  filtersCount,
  hasArtworks,
  hasMarketSignals,
  showModal,
  showNewWorksMessage,
}) => {
  const { showVisualClue } = useVisualClue()

  const showSubmissionMessage = showVisualClue("ArtworkSubmissionMessage")
  const enableCollectedArtists = useFeatureFlag("AREnableMyCollectionCollectedArtists")
  const selectedTab = MyCollectionTabsStore.useStoreState((state) => state.selectedTab)

  const showArtworkFilters = useMemo(() => {
    if (!enableCollectedArtists) {
      return !!hasArtworks
    }
    return selectedTab === "Artworks"
  }, [selectedTab, hasArtworks, enableCollectedArtists])

  return (
    <Flex px={2} backgroundColor="white100">
      <Messages
        showNewWorksMessage={showNewWorksMessage}
        showSubmissionMessage={showSubmissionMessage}
        hasMarketSignals={hasMarketSignals}
      />
      {!!enableCollectedArtists && (
        <Flex>
          <MainStickyHeader hasArtworks={hasArtworks} />
        </Flex>
      )}
      {!!showArtworkFilters && <Filters filtersCount={filtersCount} showModal={showModal} />}
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

  const { width } = useMeasure({ ref: closeIconRef })

  // X coordinate to which the pills will translate
  const originX = Number(width) + PILL_PADDING_IN_PX

  return (
    <>
      <Flex alignItems="center" flexDirection="row" justifyContent="space-between" p={2}>
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
            onPress={showAddToMyCollectionBottomSheet}
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

interface FiltersProps {
  filtersCount: number
  showModal: () => void
}

const Filters: React.FC<FiltersProps> = (props) => {
  const { trackEvent } = useTracking()

  const { showModal, filtersCount } = props

  const enableCollectedArtists = useFeatureFlag("AREnableMyCollectionCollectedArtists")

  if (enableCollectedArtists) {
    return <ArtworkFilters {...props} />
  }

  return (
    <Flex backgroundColor="white100">
      <ArtworksFilterHeader selectedFiltersCount={filtersCount} onFilterPress={showModal}>
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
    </Flex>
  )
}

const ArtworkFilters: React.FC<FiltersProps> = (props) => {
  const space = useSpace()
  const { showModal, filtersCount } = props
  const keyword = MyCollectionArtworksKeywordStore.useStoreState((state) => state.keyword)
  const [query, setQuery] = useState(keyword)

  const setKeyword = debounce(
    MyCollectionArtworksKeywordStore.useStoreActions((actions) => actions.setKeyword)
  )

  useEffect(() => {
    // We're making the update here to avoid having a laggy experience when typing
    setKeyword(query)
  }, [query])

  return (
    <Flex backgroundColor="white100" flexDirection="row" pb={1}>
      <Input
        testID="MyCollectionSearchBarInput"
        icon={<SearchIcon width={18} height={18} />}
        placeholder="Search Your Artworks"
        onChangeText={setQuery}
        enableClearButton
        value={query}
        returnKeyType="done"
        autoCorrect={false}
        style={{
          marginLeft: space(2),
        }}
      />

      <Flex px={2} justifyContent="center">
        <TouchableHighlightColor
          haptic
          onPress={showModal}
          testID="sort-and-filter-button"
          render={({ color }) => (
            <Flex flexDirection="row" alignItems="center">
              <FilterIcon fill={color} width={26} height={26} />
              {filtersCount > 0 && (
                <Text variant="xs" color="blue100">
                  {` ${bullet} ${filtersCount}`}
                </Text>
              )}
            </Flex>
          )}
        />
      </Flex>
    </Flex>
  )
}

const Messages: React.FC<{
  hasMarketSignals: boolean
  showNewWorksMessage: boolean
  showSubmissionMessage: boolean
}> = ({ hasMarketSignals, showNewWorksMessage, showSubmissionMessage }) => {
  if (!hasMarketSignals && !showNewWorksMessage && !showSubmissionMessage) {
    return null
  }

  return (
    <Flex>
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
    </Flex>
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
