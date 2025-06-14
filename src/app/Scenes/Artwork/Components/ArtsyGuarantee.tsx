import { ActionType, ContextModule, OwnerType, TappedLearnMore } from "@artsy/cohesion"
import { GuaranteeIcon } from "@artsy/icons/native"
import {
  Spacer,
  VerifiedIcon,
  IconProps,
  SecureLockIcon,
  Flex,
  Box,
  Text,
  LinkText,
  Join,
} from "@artsy/palette-mobile"
// eslint-disable-next-line no-restricted-imports
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
    const payload: TappedLearnMore = {
      action: ActionType.tappedLearnMore,
      context_module: ContextModule.artworkDetails,
      context_screen_owner_type: OwnerType.artwork,
      subject: "Learn more",
      flow: "Artsy Guarantee",
    }

    trackEvent(payload)
    navigate("https://www.artsy.net/buyer-guarantee")
  }

  return (
    <Box>
      <Text variant="md" color="mono100">
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
          <Text variant="sm" color="mono60">
            Secure Checkout
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center">
          <GuaranteeIcon
            accessibilityRole="image"
            accessibilityLabel="Money-Back Guarantee Icon"
            {...iconProps}
          />
          <Text variant="sm" color="mono60">
            Money-Back Guarantee
          </Text>
        </Flex>

        <Flex flexDirection="row" alignItems="center">
          <VerifiedIcon
            accessibilityRole="image"
            accessibilityLabel="Authenticity Guarantee Icon"
            {...iconProps}
          />
          <Text variant="sm" color="mono60">
            Authenticity Guarantee
          </Text>
        </Flex>

        <LinkText
          accessibilityRole="link"
          accessibilityHint="Redirects to Artsy Guarantee page"
          accessibilityLabel="Learn more about the Artsy Guarantee"
          onPress={() => handleLearnMorePress()}
          variant="xs"
          color="mono60"
        >
          Learn more
        </LinkText>
      </Join>
    </Box>
  )
}
