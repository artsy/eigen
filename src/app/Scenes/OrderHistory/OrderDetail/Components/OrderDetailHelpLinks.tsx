import { MessageIcon } from "@artsy/icons/native"
import { Box, Flex, LinkText, Spacer, Text } from "@artsy/palette-mobile"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"

const HELP_CENTER_LINK = "https://support.artsy.net/s/topic/0TO3b000000UessGAC/buy"

export const OrderDetailHelpLinks: React.FC = () => {
  return (
    <Box backgroundColor="mono5" p={2}>
      <Flex flexDirection="row" alignItems="flex-start">
        <MessageIcon fill="mono100" mt={0.5} />

        <Spacer x={0.5} />

        <Flex>
          <Text variant="sm" fontWeight="bold">
            Need help?
          </Text>

          <Text variant="xs" color="mono60">
            <LinkText onPress={() => navigate(HELP_CENTER_LINK)} variant="xs" color="mono60">
              Visit our help center
            </LinkText>
            .
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}
