import { Box, Text } from "@artsy/palette-mobile"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { Event } from "app/Scenes/City/Components/Event/Event"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { Show } from "app/utils/cityGuide/types"

export interface Props {
  title: string
  data: Show[]
  section: string
  citySlug: string
}

export const EventSection: React.FC<Props> = ({ title, data, section, citySlug }) => {
  const viewAllPressed = () => {
    navigate(`/city/${citySlug}/${section}`)
  }

  const eligibleForBrick = data.filter(
    (show) => !show.isStubShow && !!show.cover_image && !!show.cover_image.url
  )
  const finalShowsForPreviewBricks = eligibleForBrick.slice(0, 2)
  const eventBricks = finalShowsForPreviewBricks.map((event) => (
    <Box key={event.id}>
      <Event event={event} />
    </Box>
  ))

  return (
    <>
      <Box my={2}>
        <Text variant="lg-display">{title}</Text>
      </Box>
      {eventBricks}
      {data.length > 2 && (
        <Box mb={2}>
          <CaretButton onPress={() => viewAllPressed()} text={`View all ${data.length} shows`} />
        </Box>
      )}
    </>
  )
}
