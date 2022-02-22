import { ActionType, OwnerType, TappedMakeOffer } from "@artsy/cohesion"
import { navigate } from "lib/navigation/navigate"
import { Button, CheckCircleIcon, Flex, Text } from "palette"
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
          <CheckCircleIcon mr={1} mt="3px" />
          <Flex flexShrink={1}>
            <Text color="black60" variant="xs" mb={1}>
              Only purchases completed with our secure checkout are protected by{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                color="black100"
                variant="xs"
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
          Make Offer
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
