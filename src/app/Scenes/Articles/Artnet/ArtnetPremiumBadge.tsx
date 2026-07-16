import { LockIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"

/** Small "Pro" lock badge for gated (Artnet News Pro) content. */
export const ArtnetPremiumBadge: React.FC = () => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      backgroundColor="mono100"
      px={0.5}
      py={0.5}
      borderRadius={2}
    >
      <LockIcon fill="mono0" width={12} height={12} />
      <Text variant="xs" color="mono0" ml={0.5}>
        Pro
      </Text>
    </Flex>
  )
}
