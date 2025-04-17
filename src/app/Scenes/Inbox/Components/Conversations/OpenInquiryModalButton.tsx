import { ActionType, OwnerType, TappedBuyNow, TappedMakeOffer } from "@artsy/cohesion"
import { Spacer, ShieldIcon, Flex, Text, Button } from "@artsy/palette-mobile"
import { OpenInquiryModalButton_artwork$data } from "__generated__/OpenInquiryModalButton_artwork.graphql"
import { ShadowSeparator } from "app/Scenes/Inbox/Components/ShadowSeparator"
import { navigate } from "app/system/navigation/navigate"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { InquiryMakeOfferButtonFragmentContainer } from "./InquiryMakeOfferButton"
import { InquiryPurchaseButtonFragmentContainer } from "./InquiryPurchaseButton"

export interface OpenInquiryModalButtonProps {
  artwork: OpenInquiryModalButton_artwork$data
  conversationID: string
}

export const OpenInquiryModalButton: React.FC<OpenInquiryModalButtonProps> = ({
  artwork,
  conversationID,
}) => {
  const { trackEvent } = useTracking()
  const { isEdition, editionSets, internalID, isOfferableFromInquiry, isAcquireable, isOfferable } =
    artwork
  const isAcquireableFromInquiry = isAcquireable
  const isOfferableConversationalBuyNow = isOfferable
  const isEditionSet = !!isEdition && (editionSets?.length ?? 0) > 1

  return (
    <>
      <ShadowSeparator />
      <Flex p={1} backgroundColor="mono0">
        <Flex flexDirection="row">
          <ShieldIcon mr={1} mt="3px" />
          <Flex flexShrink={1}>
            <Text color="mono60" variant="sm-display" mb={1} adjustsFontSizeToFit numberOfLines={2}>
              Always complete purchases with our secure checkout in order to be covered by{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                color="mono100"
                variant="sm-display"
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

        {isEditionSet ? (
          <Flex flexDirection="row">
            {!!isAcquireableFromInquiry && (
              <Flex flex={1}>
                <Button
                  onPress={() => {
                    trackEvent(tracks.trackTappedPurchase(conversationID, artwork))
                    navigate(`purchase/${internalID}`, {
                      modal: true,
                      passProps: { conversationID },
                    })
                  }}
                  size="large"
                  block
                >
                  Purchase
                </Button>
              </Flex>
            )}
            {!!isAcquireableFromInquiry &&
              (!!isOfferableFromInquiry || !!isOfferableConversationalBuyNow) && <Spacer x={1} />}
            {(!!isOfferableFromInquiry || !!isOfferableConversationalBuyNow) && (
              <Flex flex={1}>
                <Button
                  onPress={() => {
                    trackEvent(tracks.trackTappedMakeOffer(conversationID))
                    navigate(`make-offer/${internalID}`, {
                      modal: true,
                      passProps: { conversationID },
                    })
                  }}
                  size="large"
                  variant={isAcquireableFromInquiry ? "outline" : "fillDark"}
                  block
                >
                  Make an Offer
                </Button>
              </Flex>
            )}
          </Flex>
        ) : (
          <Flex flexDirection="row">
            {!!isAcquireableFromInquiry && (
              <Flex flex={1}>
                <InquiryPurchaseButtonFragmentContainer
                  artwork={artwork}
                  editionSetID={editionSets?.[0]?.internalID || null}
                  conversationID={conversationID}
                  onPress={() => trackEvent(tracks.trackTappedPurchase(conversationID, artwork))}
                  replaceModalView={false}
                >
                  Purchase
                </InquiryPurchaseButtonFragmentContainer>
              </Flex>
            )}
            {!!isAcquireableFromInquiry &&
              (!!isOfferableFromInquiry || !!isOfferableConversationalBuyNow) && <Spacer x={1} />}
            {(!!isOfferableFromInquiry || !!isOfferableConversationalBuyNow) && (
              <Flex flex={1}>
                <InquiryMakeOfferButtonFragmentContainer
                  variant={isAcquireableFromInquiry ? "fillDark" : "outline"}
                  artwork={artwork}
                  editionSetID={editionSets?.[0]?.internalID || null}
                  conversationID={conversationID}
                  onPress={() => trackEvent(tracks.trackTappedMakeOffer(conversationID))}
                  replaceModalView={false}
                >
                  Make an Offer
                </InquiryMakeOfferButtonFragmentContainer>
              </Flex>
            )}
          </Flex>
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
  trackTappedPurchase: (
    id: string,
    artwork: OpenInquiryModalButton_artwork$data
  ): TappedBuyNow => ({
    action: ActionType.tappedBuyNow,
    context_owner_type: OwnerType.conversation,
    context_owner_id: artwork.internalID,
    context_owner_slug: artwork.slug,
    impulse_conversation_id: id,
    flow: undefined,
  }),
}

export const OpenInquiryModalButtonFragmentContainer = createFragmentContainer(
  OpenInquiryModalButton,
  {
    artwork: graphql`
      fragment OpenInquiryModalButton_artwork on Artwork {
        internalID
        slug
        isEdition
        isOfferable
        isOfferableFromInquiry
        isAcquireable
        editionSets {
          internalID
        }
        ...InquiryMakeOfferButton_artwork
        ...InquiryPurchaseButton_artwork
      }
    `,
  }
)
