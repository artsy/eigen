import { RegisterToBidButton_sale$key } from "__generated__/RegisterToBidButton_sale.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Box, Button, CheckIcon, Flex, Spacer, Text } from "palette"
import React, { useRef } from "react"
import { useTracking } from "react-tracking"
import { graphql, useFragment } from "relay-hooks"
import { saleStatus } from "../helpers"

const saleFragment = graphql`
  fragment RegisterToBidButton_sale on Sale {
    slug
    startAt
    endAt
    requireIdentityVerification
    registrationStatus {
      qualifiedForBidding
    }
  }
`

interface RegisterToBidButtonProps {
  sale: RegisterToBidButton_sale$key
}

export const RegisterToBidButton: React.FC<RegisterToBidButtonProps> = (props) => {
  const sale = useFragment(saleFragment, props.sale)
  const { trackEvent } = useTracking()
  const navRef = useRef<any>(null)

  if (sale.registrationStatus === null) {
    return (
      <Box my="2" ref={navRef}>
        <Button
          block
          size="large"
          onPress={() => {
            trackEvent(tracks.auctionBidButtonTapped(sale.slug, saleStatus(sale.startAt, sale.endAt)))

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

  if (sale.registrationStatus.qualifiedForBidding) {
    return (
      <Flex flexDirection="row" my="2">
        <CheckIcon fill="green100" mr={8} />
        <Text color="green100">You're approved to bid</Text>
      </Flex>
    )
  } else {
    return (
      <Button block size="large" disabled my="2">
        Registration pending
      </Button>
    )
  }
}

const tracks = {
  auctionBidButtonTapped: (slug: string, status: string) => ({
    action_name: "Tapped Register To Bid",
    auction_slug: slug,
    auction_state: status,

    // TODO: `context_type` should be something like
    // self.navigationController.topViewController == self ? "sale" : "sale information"
    // so that it sends `sale` when we are in the auction page, and `sale information` when we are in the info page of an auction.
    // We don't have the info page migrated to RN yet. We should fix this when we do.
    context_type: "sale",
  }),
}
