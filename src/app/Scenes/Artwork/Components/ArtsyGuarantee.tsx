import { ActionType } from "@artsy/cohesion"
import {
  Spacer,
  VerifiedIcon,
  IconProps,
  SecureLockIcon,
  GuaranteeIcon,
  Flex,
  Box,
  Text,
  LinkText,
  Join,
} from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { useTracking } from "react-tracking"

export const ArtsyGuarantee: React.FC = () => {
  const { trackEvent } = useTracking()

  const iconProps: IconProps = {
    height: 24,
    width: 24,
    mr: 1,
  }

  const handleLearnMorePress = () => {
    const payload = {
      action: ActionType.tappedLearnMore,
      context_module: "artworkDetails",
      type: "Link",
      subject: "Learn more",
      flow: "Artsy Guarantee",
    }

    trackEvent(payload)
    navigate("https://www.artsy.net/buyer-guarantee")
  }

  return (
    <Box>
      <Text variant="md" color="black100">
        Be covered by the Artsy Guarantee when you check out with Artsy
      </Text>
      <Spacer y={2} />

      <Join separator={<Spacer y={1} />}>
        <Flex flexDirection="row" alignItems="center">
          <SecureLockIcon
            accessibilityRole="image"
            accessibilityLabel="Secure Checkout Icon"
            {...iconProps}
          />
          <Text variant="sm" color="black60">
            Secure Checkout
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center">
          <GuaranteeIcon
            accessibilityRole="image"
            accessibilityLabel="Money-Back Guarantee Icon"
            {...iconProps}
          />
          <Text variant="sm" color="black60">
            Money-Back Guarantee
          </Text>
        </Flex>

        <Flex flexDirection="row" alignItems="center">
          <VerifiedIcon
            accessibilityRole="image"
            accessibilityLabel="Authenticity Guarantee Icon"
            {...iconProps}
          />
          <Text variant="sm" color="black60">
            Authenticity Guarantee
          </Text>
        </Flex>

        <LinkText
          accessibilityRole="link"
          accessibilityHint="Redirects to Artsy Guarantee page"
          accessibilityLabel="Learn more about the Artsy Guarantee"
          onPress={() => handleLearnMorePress()}
          variant="xs"
          color="black60"
        >
          Learn more
        </LinkText>
      </Join>
    </Box>
  )
}
