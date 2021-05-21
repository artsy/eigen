import { tappedMakeOffer } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { OpenInquiryModalButtonQuery } from "__generated__/OpenInquiryModalButtonQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Button, CheckCircleIcon, Flex, Text } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { ShadowSeparator } from "../ShadowSeparator"

export interface OpenInquiryModalButtonProps {
  artworkID: string
  conversationID: string | null | undefined
}

export const OpenInquiryModalButton: React.FC<OpenInquiryModalButtonProps> = ({ artworkID, conversationID }) => {
  const { trackEvent } = useTracking()

  return (
    <>
      <ShadowSeparator />
      <Flex p={1}>
        <Flex flexDirection="row">
          <CheckCircleIcon mr={1} mt="3px" />
          <Flex flexShrink={1}>
            <Text color="black60" variant="small" mb={1}>
              Only purchases completed with our secure checkout are protected by{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                color="black100"
                variant="small"
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
            trackEvent(tappedMakeOffer(conversationID as string))
            navigate(`make-offer/${artworkID}`, {
              modal: true,
              passProps: { conversationID },
            })
          }}
          size="large"
          variant="primaryBlack"
          block
          width={100}
        >
          Make Offer
        </Button>
      </Flex>
    </>
  )
}

export const OpenInquiryModalButtonQueryRenderer: React.FC<{
  artworkID: string
  conversationID: string
}> = ({ artworkID, conversationID }) => {
  return (
    <QueryRenderer<OpenInquiryModalButtonQuery>
      environment={defaultEnvironment}
      query={graphql`
        query OpenInquiryModalButtonQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            isOfferableFromInquiry
          }
        }
      `}
      variables={{
        artworkID,
      }}
      cacheConfig={{ force: true }}
      render={({ props, error }): null | JSX.Element => {
        if (error) {
          // A typical scenario an error happens would be 404 (artwork deleted, unpublished, etc.). This captures the
          // error in Sentry and simply doesn't render to button for now. We can be more specific about particular
          // errors and also improve the UX through some messaging.
          captureMessage(error.stack!)
          return null
        }

        if (props?.artwork?.isOfferableFromInquiry) {
          return <OpenInquiryModalButton artworkID={artworkID} conversationID={conversationID} />
        } else {
          return null
        }
      }}
    />
  )
}
