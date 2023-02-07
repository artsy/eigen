import { apostrophe, quoteLeft, quoteRight, Spacer } from "@artsy/palette-mobile"
import { Flex, Text } from "palette"
import { NotificationType } from "./types"

interface ActivityEmptyViewProps {
  type: NotificationType
}

const entityByType: Record<NotificationType, { title: string; message: string }> = {
  all: {
    title: `You haven${apostrophe}t followed any artists, galleries or fairs yet.`,
    message:
      "Follow artists to keep track of their latest work and career highlights. Following artists helps Artsy to recommend works you might like.",
  },
  alerts: {
    title: `Set alerts for artworks you${apostrophe}re seeking.`,
    message: `Filter for the artworks you love on an artist page and tap ${quoteLeft}Create Alert.${quoteRight} Get notifications here when there${apostrophe}s a match.`,
  },
}

export const ActivityEmptyView: React.FC<ActivityEmptyViewProps> = ({ type }) => {
  const entity = entityByType[type]

  return (
    <Flex mx={2} accessibilityLabel="Activities are empty">
      <Text textAlign="center">{entity.title}</Text>
      <Spacer y="2" />
      <Text variant="xs" color="black60" textAlign="center">
        {entity.message}
      </Text>
    </Flex>
  )
}
