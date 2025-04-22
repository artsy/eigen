import { Flex, Text, TextProps } from "@artsy/palette-mobile"
import { ArtworkSaleMessage_artwork$key } from "__generated__/ArtworkSaleMessage_artwork.graphql"
import { useMetaDataTextColor } from "app/Components/ArtworkRail/ArtworkRailUtils"
import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"
import { displayAsLinethrought, parsedSaleMessage } from "app/utils/getSaleMessgeOrBidInfo"
import { getTimer } from "app/utils/getTimer"
import { graphql, useFragment } from "react-relay"

interface ArtworkSaleMessageProps {
  artwork: ArtworkSaleMessage_artwork$key
  displayLimitedTimeOfferSignal: boolean | null | undefined
  saleMessage: string | null | undefined
  saleInfoTextStyle?: TextProps
  dark?: boolean
}

export const ArtworkSaleMessage: React.FC<ArtworkSaleMessageProps> = ({
  artwork,
  displayLimitedTimeOfferSignal,
  saleMessage,
  saleInfoTextStyle,
  dark = false,
}) => {
  const { collectorSignals, sale } = useFragment(fragment, artwork)

  const { primaryColor } = useMetaDataTextColor({ dark })

  const partnerOfferEndAt = collectorSignals?.partnerOffer?.endAt
    ? formattedTimeLeft(getTimer(collectorSignals?.partnerOffer.endAt).time).timerCopy
    : ""

  const auctionInLiveBidding = sale?.isAuction && collectorSignals?.auction?.liveBiddingStarted
  const saleInfoTextColor = auctionInLiveBidding ? "blue100" : primaryColor
  const saleInfoTextWeight = auctionInLiveBidding ? "normal" : "bold"

  const { parts } = parsedSaleMessage(saleMessage)

  if (!parts) return null

  if (displayLimitedTimeOfferSignal) {
    return (
      <>
        <Flex flexDirection="row">
          {parts.map((part, index) => {
            if (displayAsLinethrought(part)) {
              return (
                <Text
                  key={index}
                  lineHeight="20px"
                  variant="xs"
                  color="mono60"
                  numberOfLines={1}
                  style={{ textDecorationLine: "line-through" }}
                >
                  {" "}
                  {part.slice(1, -1)}
                </Text>
              )
            }
            return (
              <Text
                key={index}
                lineHeight="20px"
                variant="xs"
                color={saleInfoTextColor}
                numberOfLines={1}
                fontWeight={saleInfoTextWeight}
                {...saleInfoTextStyle}
              >
                {part}
              </Text>
            )
          })}
        </Flex>
        <Text
          lineHeight="20px"
          variant="xs"
          fontWeight="normal"
          color="blue100"
          numberOfLines={1}
          {...saleInfoTextStyle}
        >
          Offer Expires {partnerOfferEndAt}
        </Text>
      </>
    )
  } else
    return (
      <Text
        lineHeight="20px"
        variant="xs"
        color={saleInfoTextColor}
        numberOfLines={1}
        fontWeight={saleInfoTextWeight}
        {...saleInfoTextStyle}
      >
        {saleMessage}
      </Text>
    )
}

const fragment = graphql`
  fragment ArtworkSaleMessage_artwork on Artwork {
    collectorSignals {
      partnerOffer {
        endAt
      }
      auction {
        liveBiddingStarted
      }
    }
    sale {
      isAuction
    }
  }
`
