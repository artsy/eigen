import { ContextModule, ScreenOwnerType, tappedRegisterToBid, TappedRegisterToBidArgs } from "@artsy/cohesion"
import { RegisterToBidButton_me } from "__generated__/RegisterToBidButton_me.graphql"
import { RegisterToBidButton_sale } from "__generated__/RegisterToBidButton_sale.graphql"
import { Box, Button, CheckIcon, Flex, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { navigate } from "../../../navigation/navigate"

interface RegisterToBidButtonProps {
  sale: RegisterToBidButton_sale
  me: RegisterToBidButton_me
  contextType: ScreenOwnerType
}

const RegisterToBidButton: React.FC<RegisterToBidButtonProps> = ({ me, sale, contextType }) => {
  const { trackEvent } = useTracking()

  if (sale.registrationStatus === null) {
    return (
      <Box>
        <Button
          block
          size="large"
          onPress={() => {
            trackEvent(
              tracks.auctionBidButtonTapped({
                contextScreenOwnerSlug: sale.slug,
                contextScreenOwnerId: sale.id,
                contextType,
              })
            )
            navigate(`/auction-registration/${sale.slug}`)
          }}
        >
          Register to bid
        </Button>
        <Spacer mt={15} />

        {sale.requireIdentityVerification ? (
          <Box>
            <Text variant="caption" color="black60">
              This auction requires identity verification to bid.
            </Text>
            <Text
              variant="caption"
              color="black60"
              style={{ textDecorationLine: "underline" }}
              onPress={() => navigate("/identity-verification-faq")}
            >
              Learn more.
            </Text>
          </Box>
        ) : (
          <Text variant="caption" color="black60">
            Registration is required to bid.
          </Text>
        )}
      </Box>
    )
  }

  if (sale.registrationStatus?.qualifiedForBidding) {
    // If the user alrady bidded on some lots, we don' have to remind them they are approved to bid
    if (me?.biddedLots && me.biddedLots.length > 0) {
      return null
    } else {
      return (
        <Flex flexDirection="row">
          <CheckIcon fill="green100" mr={8} />
          <Text color="green100" fontWeight="500">
            You're approved to bid
          </Text>
        </Flex>
      )
    }
  } else {
    return (
      <Button block size="large" disabled>
        Registration pending
      </Button>
    )
  }
}

export const RegisterToBidButtonContainer = createFragmentContainer(RegisterToBidButton, {
  sale: graphql`
    fragment RegisterToBidButton_sale on Sale {
      slug
      startAt
      endAt
      id
      requireIdentityVerification
      registrationStatus {
        qualifiedForBidding
      }
    }
  `,
  me: graphql`
    fragment RegisterToBidButton_me on Me @argumentDefinitions(saleID: { type: "String" }) {
      biddedLots: lotStandings(saleID: $saleID) {
        saleArtwork {
          id
        }
      }
    }
  `,
})

const tracks = {
  auctionBidButtonTapped: ({
    contextScreenOwnerId,
    contextScreenOwnerSlug,
    contextType,
  }: {
    contextScreenOwnerId: string
    contextScreenOwnerSlug: string
    contextType: ScreenOwnerType
  }) => {
    const trackArgs: TappedRegisterToBidArgs = {
      contextModule: contextType === "sale" ? ContextModule.auctionHome : ContextModule.auctionsInfo,
      contextScreenOwnerType: contextType,
      contextScreenOwnerId,
      contextScreenOwnerSlug,
    }
    return tappedRegisterToBid(trackArgs)
  },
}
