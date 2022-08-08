import { AverageAuctionPriceRail_me$key } from "__generated__/AverageAuctionPriceRail_me.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { groupBy } from "lodash"
import { Flex, Spacer } from "palette"
import { FlatList } from "react-native-gesture-handler"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { AverageAuctionPriceListItem } from "./AverageAuctionPriceListItem"

interface AverageAuctionPriceRailProps {
  me: AverageAuctionPriceRail_me$key
}

export const AverageAuctionPriceRail: React.FC<AverageAuctionPriceRailProps> = (props) => {
  const enableMyCollectionInsightsPhase1Part3 = useFeatureFlag(
    "AREnableMyCollectionInsightsPhase1Part3"
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
          title="Median Auction Price in the Last 3 Years"
          onPress={
            enableMyCollectionInsightsPhase1Part3
              ? () => {
                  navigate(
                    `/my-collection/average-sale-price-at-auction/${artworks[0].artist?.internalID}`
                  )
                }
              : undefined
          }
          mb={2}
        />
      </Flex>
      <FlatList
        data={groupedArtworks}
        listKey="average-sale-prices"
        renderItem={({ item }) => (
          <AverageAuctionPriceListItem
            artworks={item}
            onPress={
              enableMyCollectionInsightsPhase1Part3
                ? () => {
                    navigate(
                      `/my-collection/average-sale-price-at-auction/${item[0].artist?.internalID}`
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
  fragment AverageAuctionPriceRail_me on Me {
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
