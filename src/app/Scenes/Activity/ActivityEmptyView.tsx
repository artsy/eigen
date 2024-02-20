import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NotificationType } from "./types"

interface ActivityEmptyViewProps {
  type: NotificationType
}

const entityByType: Record<NotificationType, { title: string; message: string }> = {
  all: {
    title: "Follow artists and galleries to stay up to date",
    message:
      "Keep track of the art and events you love, and get recommendations based on who you follow.",
  },
  alerts: {
    title: "Hunting for a particular artwork?",
    message:
      "Create alerts on an artist or artwork page and get notifications here when there’s a match.",
  },
  offers: {
    title: "Your offers will appear here",
    message: "When you receive an offer on an artwork, it will appear here.",
  },
  follows: {
    title: "",
    message: "",
  },
}

export const ActivityEmptyView: React.FC<ActivityEmptyViewProps> = ({ type }) => {
  const entity = entityByType[type]
  const enableNewActivityPanelManagement = useFeatureFlag("AREnableNewActivityPanelManagement")

  return (
    <Flex
      mx={2}
      accessibilityLabel="Activities are empty"
      pt={enableNewActivityPanelManagement ? 2 : 0}
    >
      <Text textAlign="center">{entity.title}</Text>
      <Spacer y={2} />
      <Text variant="xs" color="black60" textAlign="center">
        {entity.message}
      </Text>
    </Flex>
  )
}
