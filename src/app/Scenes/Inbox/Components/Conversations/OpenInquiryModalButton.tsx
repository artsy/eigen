import { ActionType, OwnerType, TappedMakeOffer } from "@artsy/cohesion"
import { navigate } from "app/navigation/navigate"
import { Button, Flex, ShieldIcon, Text } from "palette"
import React from "react"
import { useTracking } from "react-tracking"
import { ShadowSeparator } from "../ShadowSeparator"

export interface OpenInquiryModalButtonProps {
  artworkID: string
  conversationID: string
}

export const OpenInquiryModalButton: React.FC<OpenInquiryModalButtonProps> = ({
  artworkID,
  conversationID,
}) => {
  const { trackEvent } = useTracking()

  return (
    <>
      <ShadowSeparator />
      <Flex p={1}>
        <Flex flexDirection="row">
          <ShieldIcon mr={1} mt="3px" />
          <Flex flexShrink={1}>
            <Text color="black60" variant="md" mb={1}>
              Always complete purchases with our secure checkout in order to be covered by{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                color="black100"
                variant="md"
                onPress={() => {
                  navigate(`/buyer-guarantee`)
                }}
              >
                The Artsy Guarantee
              </Text>
              .
            </Text>
          </Flex>
        </Flex>
        <Button
          onPress={() => {
            trackEvent(tracks.trackTappedMakeOffer(conversationID))
            navigate(`make-offer/${artworkID}`, {
              modal: true,
              passProps: { conversationID },
            })
          }}
          size="large"
          variant="fillDark"
          block
          width={100}
        >
          Make an Offer
        </Button>
      </Flex>
    </>
  )
}

const tracks = {
  trackTappedMakeOffer: (id: string): TappedMakeOffer => ({
    action: ActionType.tappedMakeOffer,
    context_owner_type: OwnerType.conversation,
    impulse_conversation_id: id,
  }),
}
