import { Flex, Text } from "@artsy/palette-mobile"

interface CollectorNoteProps {
  note: string
  dark?: boolean
}

/**
 * Renders a curator's note for an artwork within a marketing collection.
 *
 * The note is an edge-level field on `MarketingCollection.artworksConnection`
 * (not a field on the `Artwork` node), so it is passed in as a plain string
 * prop rather than via a Relay fragment. It is intentionally distinct from the
 * collector social signal badge (`ArtworkSocialSignal`) and is meant to render
 * directly above it.
 */
export const CollectorNote: React.FC<CollectorNoteProps> = ({ note, dark = false }) => {
  if (!note) {
    return null
  }

  const primaryColor = dark ? "mono0" : "mono100"
  const secondaryColor = dark ? "mono30" : "mono60"

  return (
    <Flex flexDirection="column">
      <Text color={secondaryColor} variant="xs">
        Curator’s note
      </Text>
      <Text color={primaryColor} variant="xs" numberOfLines={2} ellipsizeMode="tail">
        {note}
      </Text>
    </Flex>
  )
}
