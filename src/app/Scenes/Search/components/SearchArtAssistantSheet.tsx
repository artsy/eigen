import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ChevronDownIcon, ChevronUpIcon, SparklesMessageIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { tappedArtAssistant } from "app/Components/GlobalSearchInput/artAssistantTracks"
import { BOTTOM_TABS_HEIGHT } from "app/Navigation/AuthenticatedRoutes/Tabs"
import {
  ArtAssistantConversation,
  ArtAssistantConversationHeaderProps,
  ArtAssistantPromptRequest,
} from "app/Scenes/ArtAssistant/Components/ArtAssistantConversation"
import { useSearchArtAssistantContext } from "app/Scenes/Search/SearchArtAssistantContext"
import { buildSearchArtAssistantPrompt } from "app/Scenes/Search/utils/buildSearchArtAssistantPrompt"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTracking } from "react-tracking"

export const SEARCH_ART_ASSISTANT_SHEET_COLLAPSED_HEIGHT = 64

const COLLAPSED_INDEX = 0
const EXPANDED_INDEX = 1
const SNAP_POINTS = [SEARCH_ART_ASSISTANT_SHEET_COLLAPSED_HEIGHT, "92%"]
const SHEET_CORNER_RADIUS = 20

export const SearchArtAssistantSheet: React.FC = () => {
  const color = useColor()
  const { bottom } = useSafeAreaInsets()
  const { trackEvent } = useTracking()
  const { query, filters } = useSearchArtAssistantContext()
  const sheetRef = useRef<BottomSheet>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  // The conversation is mounted on the first expand and kept, so closing the sheet never loses it.
  const [hasExpanded, setHasExpanded] = useState(false)
  const [promptRequest, setPromptRequest] = useState<ArtAssistantPromptRequest | null>(null)
  const lastRequestedPrompt = useRef("")
  const latestSearch = useRef({ query, filters })

  latestSearch.current = { query, filters }

  const expand = () => sheetRef.current?.snapToIndex(EXPANDED_INDEX)
  const collapse = () => sheetRef.current?.snapToIndex(COLLAPSED_INDEX)

  // gorhom calls this from an animation worklet that keeps the callback from an early render, so
  // it must not read the search. The prompt is built in the effect below instead.
  const handleChange = (index: number) => {
    const nextIsExpanded = index === EXPANDED_INDEX

    setIsExpanded(nextIsExpanded)

    if (nextIsExpanded) {
      trackEvent(
        tappedArtAssistant({
          contextModule: ContextModule.artAssistant,
          contextScreenOwnerType: OwnerType.search,
          type: "button",
        })
      )
    }
  }

  // Each time the sheet opens, a search that changed since the last request goes into the
  // conversation as a new message. Only the opening counts, so typing behind an open sheet does
  // not send anything.
  useEffect(() => {
    if (!isExpanded) {
      return
    }

    setHasExpanded(true)

    const prompt = buildSearchArtAssistantPrompt(latestSearch.current)

    if (!prompt || prompt === lastRequestedPrompt.current) {
      return
    }

    lastRequestedPrompt.current = prompt
    setPromptRequest((current) => ({ id: (current?.id ?? 0) + 1, text: prompt }))
  }, [isExpanded])

  const renderHandle = useCallback(
    () => (
      <Flex alignItems="center" pt={1}>
        <Flex backgroundColor="mono30" borderRadius={2} height={4} width={40} />

        {!isExpanded && (
          <Touchable
            accessibilityLabel="Open Art Assistant"
            accessibilityRole="button"
            onPress={expand}
            style={{ alignSelf: "stretch" }}
          >
            <Flex
              alignItems="center"
              flexDirection="row"
              height={SEARCH_ART_ASSISTANT_SHEET_COLLAPSED_HEIGHT - 12}
              justifyContent="space-between"
              px={2}
            >
              <Flex alignItems="center" flexDirection="row" gap={1}>
                <SparklesMessageIcon fill="mono100" />
                <Text variant="sm-display">Art Assistant</Text>
              </Flex>

              <ChevronUpIcon fill="mono100" />
            </Flex>
          </Touchable>
        )}
      </Flex>
    ),
    [isExpanded]
  )

  const renderExpandedHeader = ({
    hasMessages,
    onNewChat,
  }: ArtAssistantConversationHeaderProps) => (
    <Flex alignItems="center" flexDirection="row" justifyContent="space-between" px={2} pb={1}>
      <SparklesMessageIcon fill="mono100" />

      <Flex alignItems="center" flexDirection="row" gap={2}>
        {!!hasMessages && (
          <Touchable
            accessibilityLabel="Start a new chat"
            accessibilityRole="button"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={onNewChat}
          >
            <Text variant="sm-display" style={{ textDecorationLine: "underline" }}>
              Reset
            </Text>
          </Touchable>
        )}

        <Touchable
          accessibilityLabel="Collapse Art Assistant"
          accessibilityRole="button"
          hitSlop={DEFAULT_HIT_SLOP}
          onPress={collapse}
        >
          <ChevronDownIcon fill="mono100" />
        </Touchable>
      </Flex>
    </Flex>
  )

  return (
    <BottomSheet
      ref={sheetRef}
      backgroundStyle={{
        backgroundColor: color("mono0"),
        borderTopLeftRadius: SHEET_CORNER_RADIUS,
        borderTopRightRadius: SHEET_CORNER_RADIUS,
        // The shadow sits on the rounded background so it follows the corners.
        elevation: 16,
        shadowColor: color("mono100"),
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      }}
      // The tab bar floats over the screen, so the sheet has to sit above it.
      bottomInset={BOTTOM_TABS_HEIGHT + bottom}
      enableContentPanningGesture={false}
      // Dynamic sizing waits for a BottomSheetView to measure its content, which this sheet does
      // not use, so the snap points would never be applied.
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      handleComponent={renderHandle}
      index={COLLAPSED_INDEX}
      onChange={handleChange}
      snapPoints={SNAP_POINTS}
    >
      {!!hasExpanded && (
        <ArtAssistantConversation
          bottomInset={0}
          onClose={collapse}
          promptRequest={promptRequest}
          renderHeader={renderExpandedHeader}
        />
      )}
    </BottomSheet>
  )
}
