import { SectionTitle } from "app/Components/SectionTitle"
import { Flex } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { AverageSalePriceListItem, AverageSalePriceListSeparator } from "./AverageSalePriceListItem"

const item2 = {
  artist: { name: "Andy Warhol" },
  images: {
    thumbnail: {
      url: "https://d2v80f5yrouhh2.cloudfront.net/EBrAWqoP97vgCzSdnlRKgg/thumbnail.jpg",
    },
  },
  priceRealized: { cents: 1100000, display: "€11,000", displayUSD: "US$11,806" },
  title: "Some title, 1234",
  medium: "Painting",
}
const data = [item2, item2]
export const AverageSalePriceRail: React.FC = () => {
  return (
    <Flex pb={2}>
      <Flex mx={2}>
        <SectionTitle
          capitalized={false}
          title="Average Sale Price at Auction"
          onPress={() => {
            return
          }}
          mb={1}
        />
      </Flex>
      <FlatList
        data={data}
        listKey="average-sale-prices"
        renderItem={(item) => (
          <AverageSalePriceListItem
            estimatedArtwork={item.item}
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
