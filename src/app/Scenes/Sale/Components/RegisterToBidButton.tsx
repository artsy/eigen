import {
  ContextModule,
  ScreenOwnerType,
  tappedRegisterToBid,
  TappedRegisterToBidArgs,
} from "@artsy/cohesion"
import { Spacer, CheckIcon } from "@artsy/palette-mobile"
import { RegisterToBidButton_me$data } from "__generated__/RegisterToBidButton_me.graphql"
import { RegisterToBidButton_sale$data } from "__generated__/RegisterToBidButton_sale.graphql"
import { navigate } from "app/system/navigation/navigate"
import { Box, Button, Flex, Text } from "palette"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface RegisterToBidButtonProps {
  sale: RegisterToBidButton_sale$data
  me: RegisterToBidButton_me$data
  contextType: ScreenOwnerType
  contextModule: ContextModule
}

const RegisterToBidButton: React.FC<RegisterToBidButtonProps> = ({
  me,
  sale,
  contextType,
  contextModule,
}) => {
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
                contextModule,
                contextScreenOwnerSlug: sale.slug,
                contextScreenOwnerId: sale.internalID,
                contextType,
              })
            )
            navigate(`/auction-registration/${sale.slug}`)
          }}
          haptic
        >
          Register to bid
        </Button>
        <Spacer y={15} />

        {sale.requireIdentityVerification ? (
          <Box>
            <Text variant="xs" color="black60">
              This auction requires identity verification to bid.
            </Text>
            <Text
              variant="xs"
              color="black60"
              style={{ textDecorationLine: "underline" }}
              onPress={() => navigate("/identity-verification-faq")}
            >
              Learn more.
            </Text>
          </Box>
        ) : (
          <Text variant="xs" color="black60">
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
        <Flex flexDirection="row" alignItems="center">
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
      internalID
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
    contextModule,
    contextScreenOwnerId,
    contextScreenOwnerSlug,
    contextType,
  }: {
    contextModule: ContextModule
    contextScreenOwnerId: string
    contextScreenOwnerSlug: string
    contextType: ScreenOwnerType
  }) => {
    const trackArgs: TappedRegisterToBidArgs = {
      contextModule,
      contextScreenOwnerType: contextType,
      contextScreenOwnerId,
      contextScreenOwnerSlug,
    }
    return tappedRegisterToBid(trackArgs)
  },
}
