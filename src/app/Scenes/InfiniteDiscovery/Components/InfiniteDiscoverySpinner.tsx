import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { InfiniteDiscoveryHeader } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryHeader"

export const InfiniteDiscoverySpinner: React.FC = () => {
  return (
    <Screen>
      <InfiniteDiscoveryHeader />
      <Screen.Body fullwidth>
        <Flex
          flex={1}
          justifyContent="center"
          alignItems="center"
          // This is to make sure the spinner is centered regardless of the insets
          position="absolute"
          height="100%"
          width="100%"
        >
          <Spinner />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
