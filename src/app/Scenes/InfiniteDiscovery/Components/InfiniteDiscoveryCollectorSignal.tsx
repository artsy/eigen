import { Flex, LinkText, Text } from "@artsy/palette-mobile"
import { useCollectorSignal_artwork$key } from "__generated__/useCollectorSignal_artwork.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useCollectorSignal } from "app/utils/artwork/useCollectorSignal"
import { FC } from "react"

const ICON_SIZE = 18

interface InfiniteDiscoveryCollectorSignalProps {
  artwork: useCollectorSignal_artwork$key
}

export const InfiniteDiscoveryCollectorSignal: FC<InfiniteDiscoveryCollectorSignalProps> = ({
  artwork,
}) => {
  const { SignalIcon, signalTitle, signalDescription, href, hasCollectorSignal } =
    useCollectorSignal({ artwork })
  const isNewUserOnboardingSession =
    GlobalStore.useAppState((state) => state.onboarding.onboardingState) === "incomplete"

  if (!hasCollectorSignal) {
    return null
  }

  return (
    <Flex>
      <Flex flexDirection="row" gap={0.5} alignItems="flex-end">
        <SignalIcon fill="mono100" width={ICON_SIZE} height={ICON_SIZE} />

        <Text variant="xs" color="mono100">
          {signalTitle}
        </Text>
      </Flex>

      <Flex flex={1} flexDirection="row" gap={0.5}>
        <Flex style={{ width: ICON_SIZE, height: ICON_SIZE }} />

        {href && !isNewUserOnboardingSession ? (
          <RouterLink to={href} hasChildTouchable>
            <LinkText variant="xs" color="mono100">
              {signalDescription}
            </LinkText>
          </RouterLink>
        ) : (
          <Text variant="xs" color="mono100">
            {signalDescription}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
