import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { ScrollView } from "react-native-gesture-handler"
import { NotificationType } from "./types"

interface ActivityEmptyViewProps {
  type: NotificationType
  refreshControl?: React.ReactElement
}

const artistLink = (
  <RouterLink to="/artists">
    <Text variant="xs" underline>
      Artists
    </Text>
  </RouterLink>
)

const galleriesLink = (
  <RouterLink to="/galleries">
    <Text variant="xs" underline>
      Galleries
    </Text>
  </RouterLink>
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

export const ActivityEmptyView: React.FC<ActivityEmptyViewProps> = ({ type, refreshControl }) => {
  const entity = entityByType[type]

  if (!entity) return <></>

  if (type !== "offers") {
    return (
      <ScrollView contentContainerStyle={{ height: 500 }} refreshControl={refreshControl}>
        <Flex mx={4} accessibilityLabel="Activities are empty" pt={4}>
          <Text variant="sm-display">{entity.title}</Text>
          <Spacer y={2} />
          <Text variant="xs" color="mono60">
            {entity.message}
          </Text>
          <Spacer y={2} />
          <Flex flexDirection="row" gap={1}>
            <Text variant="xs" color="mono60">
              {entity.geStartedMessage}
            </Text>
            {entity.links}
          </Flex>
        </Flex>
      </ScrollView>
    )
  }

  return (
    <Flex mx={2} accessibilityLabel="Activities are empty" pt={0}>
      <Text textAlign="center">{entity.title}</Text>
      <Spacer y={2} />
      <Text variant="xs" color="mono60" textAlign="center">
        {entity.message}
      </Text>
    </Flex>
  )
}
