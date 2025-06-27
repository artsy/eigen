import { ShieldIcon } from "@artsy/icons/native"
import { Flex, LinkText, Message, Text } from "@artsy/palette-mobile"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"

const BUYER_GUARANTEE_LINK = "https://support.artsy.net/s/article/The-Artsy-Guarantee"

export const OrderDetailBuyerProtection: React.FC = () => {
  return (
    <Message variant="default" containerStyle={{ px: 1 }}>
      <Flex flexDirection="row" alignItems="flex-start">
        <ShieldIcon fill="mono100" mr={0.5} mt="2px" />

        <Flex flex={1}>
          <Text variant="xs">
            Your purchase is protected with{" "}
            <LinkText onPress={() => navigate(BUYER_GUARANTEE_LINK)} variant="xs">
              Artsy’s buyer protection
            </LinkText>
            .
          </Text>
        </Flex>
      </Flex>
    </Message>
  )
}
