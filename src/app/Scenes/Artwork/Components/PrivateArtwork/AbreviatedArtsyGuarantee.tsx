import { ActionType, ContextModule, OwnerType, TappedLearnMore } from "@artsy/cohesion"
import { LinkText, Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { useTracking } from "react-tracking"

export const AbreviatedArtsyGuarantee: React.FC = () => {
  const { trackEvent } = useTracking()

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
    <>
      <Text variant="xs" color="mono60">
        Be covered by the Artsy Guarantee when you checkout with Artsy{" "}
        <LinkText
          onPress={() => {
            handleLearnMorePress()
          }}
        >
          <Text variant="xs">Learn more</Text>
        </LinkText>
      </Text>
    </>
  )
}
