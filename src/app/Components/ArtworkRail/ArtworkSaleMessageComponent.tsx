import { Flex, Text } from "@artsy/palette-mobile"
import { ArtworkSaleMessageComponent_artwork$key } from "__generated__/ArtworkSaleMessageComponent_artwork.graphql"
import { useMetaDataTextColor } from "app/Components/ArtworkRail/ArtworkRailUtils"
import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"
import { getTimer } from "app/utils/getTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"

interface ArtworkSaleMessageComponentProps {
  artwork: ArtworkSaleMessageComponent_artwork$key
  displayLimitedTimeOfferSignal: boolean | null | undefined
  saleMessage: string | null | undefined
  dark: boolean
}

export const ArtworkSaleMessageComponent: React.FC<ArtworkSaleMessageComponentProps> = ({
  artwork,
  displayLimitedTimeOfferSignal,
  saleMessage,
  dark,
}) => {
  const enableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")

  const { collectorSignals, sale } = useFragment(fragment, artwork)

  const { primaryTextColor } = useMetaDataTextColor({ dark })

  const displayAuctionSignal = enableAuctionImprovementsSignals && sale?.isAuction

  const partnerOfferEndAt = collectorSignals?.partnerOffer?.endAt
    ? formattedTimeLeft(getTimer(collectorSignals?.partnerOffer.endAt).time).timerCopy
    : ""

  const saleInfoTextColor =
    displayAuctionSignal && collectorSignals?.auction?.liveBiddingStarted
      ? "blue100"
      : primaryTextColor

  const saleInfoTextWeight =
    displayAuctionSignal && collectorSignals?.auction?.liveBiddingStarted ? "normal" : "bold"

  const parts = saleMessage && saleMessage.split(/(~.*?~)/)

  if (!parts) return null

  if (displayLimitedTimeOfferSignal) {
    return (
      <>
        <Flex flexDirection="row">
          {parts.map((part, index) => {
            if (part.startsWith("~") && part.endsWith("~")) {
              return (
                <Text
                  key={index}
                  lineHeight="20px"
                  variant="xs"
                  color="black60"
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
              >
                {part}
              </Text>
            )
          })}
        </Flex>
        <Text lineHeight="20px" variant="xs" fontWeight="normal" color="blue100" numberOfLines={1}>
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
      >
        {saleMessage}
      </Text>
    )
}

const fragment = graphql`
  fragment ArtworkSaleMessageComponent_artwork on Artwork {
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
