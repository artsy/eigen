import { AuctionResultForYouListItem_auctionResult } from "__generated__/AuctionResultForYouListItem_auctionResult.graphql"
import { AuctionResultsMidEstimate } from "lib/Components/AuctionResult/AuctionResultMidEstimate"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { auctionResultHasPrice, auctionResultText } from "lib/Scenes/AuctionResult/helpers"
import { QAInfoManualPanel, QAInfoRow } from "lib/utils/QAInfo"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, color, Flex, NoArtworkIcon, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  auctionResult: AuctionResultForYouListItem_auctionResult
}

export const AuctionResultForYouListItem: React.FC<Props> = ({ auctionResult }) => {
  const QAInfo: React.FC = () => (
    <QAInfoManualPanel position="absolute" top={0} left={95}>
      <QAInfoRow name="id" value={auctionResult.internalID} />
    </QAInfoManualPanel>
  )

  return (
    <Touchable
      underlayColor={color("black5")}
      onPress={() => navigate(`/artist/${auctionResult?.artistID}/auction-result/${auctionResult?.internalID}`)}
    >
      <Flex py="2" px={2} flexDirection="row">
        {!auctionResult.images?.thumbnail?.url ? (
          <Flex
            width={60}
            height={60}
            borderRadius={2}
            backgroundColor="black10"
            alignItems="center"
            justifyContent="center"
          >
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          </Flex>
        ) : (
          <Flex
            width={60}
            height={60}
            borderRadius={2}
            backgroundColor="black"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <OpaqueImageView width={60} height={60} imageURL={auctionResult.images.thumbnail.url} />
          </Flex>
        )}

        <Flex pl={15} flex={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={3}>
            <Flex mb={"3px"}>
              <Text variant="caption" ellipsizeMode="middle" numberOfLines={2} fontWeight="bold">
                {auctionResult.artist?.name}
              </Text>
              <Text variant="caption" ellipsizeMode="middle" numberOfLines={2} style={{ flexShrink: 1 }}>
                {auctionResult.title}
                {!!auctionResult.dateText && auctionResult.dateText !== "" && `, ${auctionResult.dateText}`}
              </Text>
            </Flex>
            {!!auctionResult.mediumText && (
              <Text variant="small" color="black60" numberOfLines={1}>
                {capitalize(auctionResult.mediumText)}
              </Text>
            )}

            {!!auctionResult.saleDate && (
              <Text variant="small" color="black60" numberOfLines={1} testID="saleInfo">
                {moment(auctionResult.saleDate).utc().format("MMM D, YYYY")}
                {` ${bullet} `}
                {auctionResult.organization}
              </Text>
            )}
          </Flex>

          <Flex alignItems="flex-end" pl={15}>
            {auctionResultHasPrice(auctionResult) ? (
              <Flex alignItems="flex-end">
                <Text variant="text" fontWeight="bold" testID="price">
                  {(auctionResult.priceRealized?.display ?? "").replace(`${auctionResult.currency} `, "")}
                </Text>
                {!!auctionResult.performance?.mid && (
                  <AuctionResultsMidEstimate value={auctionResult.performance.mid} shortDescription="est" />
                )}
              </Flex>
            ) : (
              <Flex alignItems="flex-end">
                <Text variant="text" fontWeight="bold" textAlign="right" testID="price">
                  {auctionResultText(auctionResult)}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
      <QAInfo />
    </Touchable>
  )
}

export const AuctionResultForYouListItemContainer = createFragmentContainer(AuctionResultForYouListItem, {
  auctionResult: graphql`
    fragment AuctionResultForYouListItem_auctionResult on AuctionResult {
      id
      artistID
      internalID
      artist {
        name
      }
      title
      currency
      dateText
      mediumText
      saleDate
      organization
      boughtIn
      priceRealized {
        cents
        display
      }
      performance {
        mid
      }
      images {
        thumbnail {
          url
        }
      }
    }
  `,
})
