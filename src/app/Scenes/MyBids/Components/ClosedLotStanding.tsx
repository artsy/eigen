import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { StarCircleFill, Flex, Text } from "@artsy/palette-mobile"
import { ClosedLotStanding_saleArtwork$data } from "__generated__/ClosedLotStanding_saleArtwork.graphql"
import { TimelySale } from "app/Scenes/MyBids/helpers/timely"
import { navigate } from "app/system/navigation/navigate"
import moment from "moment-timezone"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { Lost, Passed, Won } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

type BidderResult = "won" | "lost" | "passed"

const saleClosedMessage: (sale: {
  endAt: string | null | undefined
  status: string | null | undefined
}) => string | undefined = (sale) => {
  const timelySale = TimelySale.create(sale)
  if (timelySale.isClosed) {
    const tz = moment.tz.guess(true)
    const endedAtMoment = moment(sale.endAt || "").tz(tz)

    return `Closed ${endedAtMoment.format("MMM D")}`
  }
}

export const ClosedLotStanding = ({
  saleArtwork,
  withTimelyInfo = true,
  inActiveSale = false,
  testID,
}: {
  saleArtwork: ClosedLotStanding_saleArtwork$data
  withTimelyInfo?: boolean
  inActiveSale?: boolean
  testID?: string
}) => {
  const tracking = useTracking()

  const sale = saleArtwork?.sale
  if (!sale) {
    return null
  }

  const sellingPrice = saleArtwork.lotState?.sellingPrice?.display || saleArtwork.estimate
  const subtitle = withTimelyInfo ? saleClosedMessage(sale) : undefined

  const result: BidderResult =
    (saleArtwork?.lotState?.soldStatus || "") === "Passed"
      ? "passed"
      : saleArtwork?.isHighestBidder
        ? "won"
        : "lost"
  const Badge = result === "won" ? StarCircleFill : undefined

  const bidderMessages: { [k in BidderResult]: React.ComponentType } = {
    won: Won,
    lost: Lost,
    passed: Passed,
  }

  const Result = bidderMessages[result]

  const handleLotTap = () => {
    tracking.trackEvent({
      action: ActionType.tappedArtworkGroup,
      context_module: inActiveSale ? ContextModule.inboxActiveBids : ContextModule.inboxClosedBids,
      context_screen_owner_type: OwnerType.inboxBids,
      destination_screen_owner_typ: OwnerType.artwork,
      destination_screen_owner_id: saleArtwork?.artwork?.internalID,
      destination_screen_owner_slug: saleArtwork?.artwork?.slug,
    })
    navigate(saleArtwork?.artwork?.href as string)
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => handleLotTap()}
      style={{ marginHorizontal: 0, width: "100%" }}
      testID={testID}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <Lot saleArtwork={saleArtwork} subtitle={subtitle} ArtworkBadge={Badge} />
        {!sale.isLiveOpen && (
          <Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              <Text variant="xs">{sellingPrice}</Text>
            </Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              <Result />
            </Flex>
          </Flex>
        )}
      </Flex>
    </TouchableOpacity>
  )
}

export const ClosedLotStandingFragmentContainer = createFragmentContainer(ClosedLotStanding, {
  saleArtwork: graphql`
    fragment ClosedLotStanding_saleArtwork on SaleArtwork {
      ...Lot_saleArtwork
      isHighestBidder
      estimate
      artwork {
        internalID
        href
        slug
      }
      lotState {
        soldStatus
        sellingPrice {
          display
        }
      }
      sale {
        isLiveOpen
        endAt
        status
      }
    }
  `,
})
