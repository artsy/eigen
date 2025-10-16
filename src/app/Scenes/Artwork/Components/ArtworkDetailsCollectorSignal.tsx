import { Flex, LinkText, Text } from "@artsy/palette-mobile"
import { useCollectorSignal_artwork$key } from "__generated__/useCollectorSignal_artwork.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useCollectorSignal } from "app/utils/artwork/useCollectorSignal"

interface Props {
  artwork: useCollectorSignal_artwork$key
}

export const ArtworkDetailsCollectorSignal: React.FC<Props> = ({ artwork }) => {
  const { signalTitle, signalDescription, href, SignalIcon } = useCollectorSignal({ artwork })

  if (!signalTitle) {
    return null
  }

  return (
    <Flex flexDirection="row" pt={4} pb={2}>
      <SignalIcon mr={0.5} fill="mono60" height={25} width={25} />

      <Flex flex={1} flexDirection="column">
        <Text variant="sm-display" color="mono100">
          {signalTitle}
        </Text>

        {href ? (
          <RouterLink to={href || "#"} hasChildTouchable>
            <LinkText variant="sm" color="mono60">
              {signalDescription}
            </LinkText>
          </RouterLink>
        ) : (
          <Text variant="sm" color="mono60">
            {signalDescription}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
