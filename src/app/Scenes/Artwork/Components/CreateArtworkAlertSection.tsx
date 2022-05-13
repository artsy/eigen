import { BellIcon, Button, Flex, Text } from "palette"

export const CreateArtworkAlertSection = () => {
  return (
    <Flex my={-2} flexDirection="row" justifyContent="space-between">
      <Flex flex={1}>
        <Text variant="xs" numberOfLines={2}>
          Be notified when a similar piece is available
        </Text>
      </Flex>

      <Flex flex={1} alignItems="flex-end" justifyContent="center">
        <Button
          size="small"
          variant="outline"
          icon={<BellIcon fill="black100" width="16px" height="16px" />}
          haptic
        >
          <Text variant="xs" ml={0.5} numberOfLines={1} lineHeight={16}>
            Create Alert
          </Text>
        </Button>
      </Flex>
    </Flex>
  )
}
