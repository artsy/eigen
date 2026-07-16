import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState } from "react"
import { Platform } from "react-native"

interface CollectorNoteProps {
  note: string
  dark?: boolean
  /** Fired when the note is tapped, before the bottom sheet opens (for tracking). */
  onTap?: () => void
}

/**
 * Renders a curator's note for an artwork within a marketing collection.
 *
 * The note is an edge-level field on `MarketingCollection.artworksConnection`
 * (not a field on the `Artwork` node), so it is passed in as a plain string
 * prop rather than via a Relay fragment. It renders as a compact, bordered
 * label (styled like the collector signal labels) that invites a tap; tapping
 * opens a bottom sheet with the full note.
 */
export const CollectorNote: React.FC<CollectorNoteProps> = ({ note, dark = false, onTap }) => {
  const [visible, setVisible] = useState(false)
  const enableCuratorNotes = useFeatureFlag("AREnableCuratorNotes")

  if (!note || !enableCuratorNotes) {
    return null
  }

  const primaryColor = dark ? "mono0" : "mono100"
  const borderColor = dark ? "mono30" : "mono60"

  // The bottom sheet renders differently on iOS vs Android; mirror the pattern
  // used elsewhere in the app (see AlertBottomSheet).
  const bottomSheetViewStyles = Platform.OS === "ios" ? { flex: 1 } : {}

  return (
    <>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel="Read the curator’s note"
        onPress={() => {
          onTap?.()
          setVisible(true)
        }}
      >
        <Flex
          flexDirection="row"
          alignItems="center"
          alignSelf="flex-start"
          borderWidth={1}
          borderColor={borderColor}
          borderRadius={3}
          px={0.5}
        >
          <Text color={primaryColor} variant="xs">
            Curator’s note
          </Text>
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
