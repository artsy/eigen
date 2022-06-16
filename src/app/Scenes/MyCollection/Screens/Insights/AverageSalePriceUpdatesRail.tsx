import { AverageSalePriceUpdatesRail_me$key } from "__generated__/AverageSalePriceUpdatesRail_me.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { groupBy } from "lodash"
import { Flex, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { AverageSalePriceUpdateListItem } from "./AverageSalePriceUpdateListItem"

interface AverageSalePriceUpdatesRailProps {
  me: AverageSalePriceUpdatesRail_me$key
}

export const AverageSalePriceUpdatesRail: React.FC<AverageSalePriceUpdatesRailProps> = (props) => {
  const me = useFragment(fragment, props.me)
  const artworks = extractNodes(me.averageSalePriceUpdates)
  const groupedArtworks = Object.values(groupBy(artworks, (artwork) => artwork?.artist?.name))

  return (
    <Flex mx={2} my={2}>
      <Flex>
        <SectionTitle
          capitalized={false}
          title="Average Auction Price in the last 3 years"
          onPress={() => {
            navigate("/my-collection/average-sale-price-at-auction")
          }}
          mb={2}
        />
      </Flex>
      <FlatList
        data={groupedArtworks}
        listKey="average-sale-prices"
        renderItem={({ item }) => (
          <AverageSalePriceUpdateListItem
            artworks={item}
            showArtistName
            onPress={() => {
              return
            }}
          />
        )}
        ItemSeparatorComponent={() => <Spacer py={2} />}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment AverageSalePriceUpdatesRail_me on Me {
    averageSalePriceUpdates: myCollectionConnection(first: 3, sortByLastAuctionResultDate: true) {
      edges {
        node {
          internalID
          medium
          title
          artist {
            name
            imageUrl
            formattedNationalityAndBirthday
          }
          marketPriceInsights {
            annualLotsSold
            annualValueSoldCents
          }
        }
      }
    }
  }
`
