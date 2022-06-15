import { AverageSalePriceRail_me$key } from "__generated__/AverageSalePriceRail_me.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { AverageSalePriceListItem, AverageSalePriceListSeparator } from "./AverageSalePriceListItem"
interface AverageSalePriceRailProps {
  me: AverageSalePriceRail_me$key
}

export const AverageSalePriceRail: React.FC<AverageSalePriceRailProps> = (props) => {
  const me = useFragment(fragment, props.me)

  const artworks = extractNodes(me.averageSalePriceUpdates)

  return (
    <Flex pb={2} pt={2}>
      <Flex mx={2}>
        <SectionTitle
          capitalized={false}
          title="Average Auction Price in the last 3 years"
          onPress={() => {
            navigate("/my-collection/average-sale-price-at-auction")
          }}
          mb={1}
        />
      </Flex>
      <FlatList
        data={artworks}
        listKey="average-sale-prices"
        renderItem={({ item }) => (
          <AverageSalePriceListItem
            artwork={item}
            withHorizontalPadding
            showArtistName
            onPress={() => {
              return
            }}
          />
        )}
        ItemSeparatorComponent={AverageSalePriceListSeparator}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment AverageSalePriceRail_me on Me {
    averageSalePriceUpdates: myCollectionConnection(first: 3) {
      edges {
        node {
          internalID
          ...AverageSalePriceListItem_artwork
        }
      }
    }
  }
`
