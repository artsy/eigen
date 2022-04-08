import { ActionType, OwnerType, TappedMakeOffer } from "@artsy/cohesion"
import { OpenInquiryModalButton_artwork } from "__generated__/OpenInquiryModalButton_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Button, Flex, ShieldIcon, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { ShadowSeparator } from "../ShadowSeparator"
import { InquiryMakeOfferButtonFragmentContainer } from "./InquiryMakeOfferButton"

export interface OpenInquiryModalButtonProps {
  artwork: OpenInquiryModalButton_artwork
  conversationID: string
}

export const OpenInquiryModalButton: React.FC<OpenInquiryModalButtonProps> = ({
  artwork,
  conversationID,
}) => {
  const { trackEvent } = useTracking()
  const { isEdition, editionSets, internalID } = artwork

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
        {!!isEdition && editionSets?.length! > 1 ? (
          <Button
            onPress={() => {
              trackEvent(tracks.trackTappedMakeOffer(conversationID))
              navigate(`make-offer/${internalID}`, {
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
        ) : (
          <InquiryMakeOfferButtonFragmentContainer
            variant="fillDark"
            artwork={artwork}
            editionSetID={editionSets?.[0]?.internalID || null}
            conversationID={conversationID}
          />
        )}
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

export const OpenInquiryModalButtonFragmentContainer = createFragmentContainer(
  OpenInquiryModalButton,
  {
    artwork: graphql`
      fragment OpenInquiryModalButton_artwork on Artwork {
        internalID
        isEdition
        editionSets {
          internalID
        }
        ...InquiryMakeOfferButton_artwork
      }
    `,
  }
)
