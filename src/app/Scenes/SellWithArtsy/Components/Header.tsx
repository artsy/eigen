import { ContextModule, OwnerType, TappedConsignArgs } from "@artsy/cohesion"
import { Box, Button, Spacer, Text } from "palette"

const consignArgs: TappedConsignArgs = {
  contextModule: ContextModule.sellHeader,
  contextScreenOwnerType: OwnerType.sell,
  subject: "Submit a work",
}

interface HeaderProps {
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}

export const Header: React.FC<HeaderProps> = ({ onConsignPress }) => {
  const handlePress = () => {
    onConsignPress(consignArgs)
  }

  return (
    <Box px={2} mt={3}>
      <Box>
        <Text variant="lg" textAlign="center" px={2}>
          Sell Art From Your Collection
        </Text>

        <Spacer my={0.5} />

        <Text variant="md" textAlign="center">
          Reach art buyers all over the world.
        </Text>
      </Box>

      <Spacer mb={2} />

      <Button testID="header-cta" variant="fillDark" block onPress={handlePress} haptic>
        <Text variant="sm" weight="medium">
          Submit a work
        </Text>
      </Button>
    </Box>
  )
}
