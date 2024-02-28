import { Flex, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NotificationType } from "./types"

interface ActivityEmptyViewProps {
  type: NotificationType
}

const artistLink = (
  <Touchable onPress={() => navigate("/artists")}>
    <Text variant="xs" underline>
      Artists
    </Text>
  </Touchable>
)

const galleriesLink = (
  <Touchable onPress={() => navigate("/galleries")}>
    <Text variant="xs" underline>
      Galleries
    </Text>
  </Touchable>
)

const entityByType: Record<
  NotificationType,
  { title: string; message: string; geStartedMessage?: any; links?: any } | null
> = {
  all: {
    title: "Stay up to date with the artists and artworks you love",
    message:
      "Follow artists and galleries to keep track of their latest updates. Or create an alert and we’ll let you know when there’s a matching work.",
    geStartedMessage: "Get started with:",
    links: (
      <>
        {artistLink}
        {galleriesLink}
      </>
    ),
  },
  follows: {
    title: "Follow artists and galleries to stay up to date",
    message: "Keep track of the art and events you love, and get updates based on who you follow.",
    geStartedMessage: "Get started with:",
    links: (
      <>
        {artistLink}
        {galleriesLink}
      </>
    ),
  },
  alerts: {
    title: "Hunting for a particular artwork?",
    message:
      "Create alerts on an artist or artwork page and get notifications here when there’s a match.",
    geStartedMessage: "Get started with:",
    links: artistLink,
  },
  // we do not display the offers pill when the user has no offers
  // will not reach the empty state of this filter
  offers: null,
}

export const ActivityEmptyView: React.FC<ActivityEmptyViewProps> = ({ type }) => {
  const entity = entityByType[type]
  const enableNewActivityPanelManagement = useFeatureFlag("AREnableNewActivityPanelManagement")

  if (!entity) return <></>

  if (enableNewActivityPanelManagement && type !== "offers") {
    return (
      <Flex mx={4} accessibilityLabel="Activities are empty" pt={4}>
        <Text textAlign="start" variant="sm-display">
          {entity.title}
        </Text>
        <Spacer y={2} />
        <Text variant="xs" color="black60" textAlign="start">
          {entity.message}
        </Text>
        <Spacer y={2} />
        <Flex flexDirection="row" gap={10}>
          <Text variant="xs" color="black60" textAlign="start">
            {entity.geStartedMessage}
          </Text>
          {entity.links}
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex mx={2} accessibilityLabel="Activities are empty" pt={0}>
      <Text textAlign="center">{entity.title}</Text>
      <Spacer y={2} />
      <Text variant="xs" color="black60" textAlign="center">
        {entity.message}
      </Text>
    </Flex>
  )
}
