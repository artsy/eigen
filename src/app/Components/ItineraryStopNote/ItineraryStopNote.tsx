import { Flex, FlexProps, Text } from "@artsy/palette-mobile"
import { ItineraryStopNoteQuery } from "__generated__/ItineraryStopNoteQuery.graphql"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

/** A City Guide curator's note on a stop, as the designs title it. */
export const ItineraryStopNoteText: React.FC<{ note: string } & FlexProps> = ({
  note,
  ...flexProps
}) => (
  <Flex testID="itinerary-stop-note" {...flexProps}>
    <Text variant="sm" weight="medium" mb={0.5}>
      What to see
    </Text>
    <Text variant="sm">{note}</Text>
  </Flex>
)

interface Props extends FlexProps {
  stopID: string
  /** The stop's itinerary's share token, which an unlisted itinerary's stop needs to be read. */
  shareToken?: string
}

const StopNote: React.FC<Props> = ({ stopID, shareToken, ...flexProps }) => {
  const data = useLazyLoadQuery<ItineraryStopNoteQuery>(query, { stopID, shareToken })
  const note = data.itineraryStop?.note?.trim()

  if (!note) return null

  return <ItineraryStopNoteText note={note} {...flexProps} />
}

const query = graphql`
  query ItineraryStopNoteQuery($stopID: String!, $shareToken: String) {
    itineraryStop(id: $stopID, shareToken: $shareToken) {
      note
    }
  }
`

/**
 * The note of the City Guide stop a show or partner page was opened from. Fetched on its own,
 * since the entity's page knows nothing of the stop. Renders nothing while loading or on
 * failure: the note is extra, and the page stands without it.
 */
export const ItineraryStopNote = withSuspense<Props>({
  Component: StopNote,
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
