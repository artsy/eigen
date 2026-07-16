import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useState } from "react"
import { Platform } from "react-native"

interface CollectorNoteProps {
  note: string
  dark?: boolean
}

// The inline badge shows at most 2 lines. Notes longer than this are very likely
// to be truncated in the narrow grid/rail card, so we surface a "Read more" cue.
// A length heuristic keeps layout stable (no measuring pass that could momentarily
// render the full note) and is good enough for a fixed-width card.
const READ_MORE_THRESHOLD = 80

/**
 * Renders a curator's note for an artwork within a marketing collection.
 *
 * The note is an edge-level field on `MarketingCollection.artworksConnection`
 * (not a field on the `Artwork` node), so it is passed in as a plain string
 * prop rather than via a Relay fragment. It is intentionally distinct from the
 * collector social signal badge (`ArtworkSocialSignal`) and renders directly
 * above it.
 *
 * The inline badge is truncated; tapping it opens a bottom sheet with the full note.
 */
export const CollectorNote: React.FC<CollectorNoteProps> = ({ note, dark = false }) => {
  const [visible, setVisible] = useState(false)

  if (!note) {
    return null
  }

  const primaryColor = dark ? "mono0" : "mono100"
  const secondaryColor = dark ? "mono30" : "mono60"
  const linkColor = dark ? "mono0" : "blue100"
  const showReadMore = note.length > READ_MORE_THRESHOLD

  // The bottom sheet renders differently on iOS vs Android; mirror the pattern
  // used elsewhere in the app (see AlertBottomSheet).
  const bottomSheetViewStyles = Platform.OS === "ios" ? { flex: 1 } : {}

  return (
    <>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel="Read the curator’s note"
        onPress={() => setVisible(true)}
      >
        <Flex flexDirection="column">
          <Text color={secondaryColor} variant="xs">
            Curator’s note
          </Text>
          <Text color={primaryColor} variant="xs" numberOfLines={2} ellipsizeMode="tail">
            {note}
          </Text>
          {!!showReadMore && (
            <Text color={linkColor} variant="xs" underline>
              Read more
            </Text>
          )}
        </Flex>
      </Touchable>

      {!!visible && (
        <AutomountedBottomSheetModal
          enableDynamicSizing
          visible
          name="CollectorNoteBottomSheet"
          onDismiss={() => setVisible(false)}
        >
          <BottomSheetView style={bottomSheetViewStyles}>
            <Flex mb={4} mx={2}>
              <Text variant="sm-display" mb={1}>
                Curator’s note
              </Text>
              <Text variant="sm">{note}</Text>
            </Flex>
          </BottomSheetView>
        </AutomountedBottomSheetModal>
      )}
    </>
  )
}
