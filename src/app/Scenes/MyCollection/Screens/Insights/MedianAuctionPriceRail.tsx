import { MedianAuctionPriceRail_me$key } from "__generated__/MedianAuctionPriceRail_me.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { groupBy } from "lodash"
import { Flex, Spacer } from "palette"
import { FlatList } from "react-native-gesture-handler"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { MedianAuctionPriceListItem } from "./MedianAuctionPriceListItem"

interface MedianAuctionPriceRailProps {
  me: MedianAuctionPriceRail_me$key
}

export const MedianAuctionPriceRail: React.FC<MedianAuctionPriceRailProps> = (props) => {
  const enableMyCollectionInsightsPhase1Part3 = useFeatureFlag(
    "AREnableMyCollectionInsightsPhase1Part3"
  )
  const enableMyCollectionInsightsMedianPrice = useFeatureFlag(
    "AREnableMyCollectionInsightsMedianPrice"
  )

  const me = useFragment(fragment, props.me)
  const artworks = extractNodes(me.priceInsightUpdates)

  if (artworks.length === 0) {
    return <></>
  }

  const groupedArtworks = Object.values(groupBy(artworks, (artwork) => artwork?.artist?.name))

  return (
    <Flex mb={4}>
      <Flex mx={2}>
        <SectionTitle
          capitalized={false}
          title={
            enableMyCollectionInsightsMedianPrice
              ? "Median Auction Price in the last 3 years"
              : "Average Auction Price in the last 3 years"
          }
          onPress={
            enableMyCollectionInsightsPhase1Part3
              ? () => {
                  navigate(
                    `/my-collection/median-sale-price-at-auction/${artworks[0].artist?.internalID}`
                  )
                }
              : undefined
          }
          mb={2}
        />
      </Flex>
      <FlatList
        data={groupedArtworks}
        listKey="median-sale-prices"
        renderItem={({ item }) => (
          <MedianAuctionPriceListItem
            artworks={item}
            onPress={
              enableMyCollectionInsightsPhase1Part3
                ? () => {
                    navigate(
                      `/my-collection/median-sale-price-at-auction/${item[0].artist?.internalID}`
                    )
                  }
                : undefined
            }
          />
        )}
        ItemSeparatorComponent={() => <Spacer py={1} />}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment MedianAuctionPriceRail_me on Me {
    priceInsightUpdates: myCollectionConnection(first: 3, sortByLastAuctionResultDate: true) {
      edges {
        node {
          internalID
          medium
          title
          artist {
            internalID
            name
            imageUrl
            formattedNationalityAndBirthday
          }
          marketPriceInsights {
            averageSalePriceDisplayText
          }
        }
      }
    }
  }
`
