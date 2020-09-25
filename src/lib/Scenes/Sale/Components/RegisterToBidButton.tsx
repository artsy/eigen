import { RegisterToBidButton_sale } from "__generated__/RegisterToBidButton_sale.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Box, Button, CheckIcon, Flex, Spacer, Text } from "palette"
import React, { useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { saleStatus } from "../helpers"

interface RegisterToBidButtonProps {
  sale: RegisterToBidButton_sale
  contextType: string
}

const RegisterToBidButtonComp: React.FC<RegisterToBidButtonProps> = ({ contextType, sale }) => {
  const { trackEvent } = useTracking()
  const navRef = useRef<any>(null)

  if (sale.registrationStatus === null) {
    return (
      <Box ref={navRef}>
        <Button
          block
          size="large"
          onPress={() => {
            trackEvent(
              tracks.auctionBidButtonTapped({
                slug: sale.slug,
                status: saleStatus(sale.startAt, sale.endAt),
                contextType,
              })
            )
            SwitchBoard.presentNavigationViewController(navRef.current, `/auction-registration/${sale.slug}`)
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
              onPress={() =>
                void SwitchBoard.presentNavigationViewController(navRef.current, "/identity-verification-faq")
              }
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
    return (
      <Flex flexDirection="row">
        <CheckIcon fill="green100" mr={8} />
        <Text color="green100">You're approved to bid</Text>
      </Flex>
    )
  } else {
    return (
      <Button block size="large" disabled>
        Registration pending
      </Button>
    )
  }
}

export const RegisterToBidButton = createFragmentContainer(RegisterToBidButtonComp, {
  sale: graphql`
    fragment RegisterToBidButton_sale on Sale {
      slug
      startAt
      endAt
      requireIdentityVerification
      registrationStatus {
        qualifiedForBidding
      }
    }
  `,
})

const tracks = {
  auctionBidButtonTapped: ({ slug, status, contextType }: { slug: string; status: string; contextType: string }) => ({
    action_name: "Tapped Register To Bid",
    auction_slug: slug,
    auction_state: status,
    context_type: contextType,
  }),
}
