import { Button, Flex, Tabs, Text } from "@artsy/palette-mobile"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"

/**
 * The "Listings" tab of My Collection. Until listings can be fetched it always shows the empty
 * state, which leads into the sell flow.
 */
export const MyCollectionListingsQueryRenderer: React.FC = () => {
  return (
    <Tabs.ScrollView testID="my-collection-listings">
      <MyCollectionListingsEmptyState />
    </Tabs.ScrollView>
  )
}

export const MyCollectionListingsEmptyState: React.FC = () => {
  return (
    <Flex bg="mono5" mt={2} px={2} py={4} gap={1} alignItems="center">
      <Text variant="lg-display" textAlign="center">
        Thought about selling?
      </Text>
      <Text variant="sm" color="mono60" textAlign="center">
        Tell us which works you have considered selling, and we can support you from there.
      </Text>

      <Flex mt={2}>
        <Button
          haptic
          variant="fillDark"
          icon={<BetaBadge />}
          iconPosition="right"
          onPress={() => navigate("/my-collection/sell")}
        >
          Sell With Us
        </Button>
      </Flex>
    </Flex>
  )
}

const BetaBadge: React.FC = () => (
  <Flex bg="mono0" borderRadius={10} px={1} ml={1}>
    <Text variant="xxs" weight="medium">
      BETA
    </Text>
  </Flex>
)
