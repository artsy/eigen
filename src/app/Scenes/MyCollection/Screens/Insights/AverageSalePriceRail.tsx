import { SectionTitle } from "app/Components/SectionTitle"
import { Flex } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { useScreenDimensions } from "shared/hooks"
import { AverageSalePriceListItem, AverageSalePriceListSeparator } from "./AverageSalePriceListItem"

const item2 = {
  artist: { name: "Andy Warhol" },
  boughtIn: false,
  currency: "EUR",
  dateText: null,
  estimate: { low: 1000000 },
  id: "QXVjdGlvblJlc3VsdDo2NjExMDU=",
  images: {
    thumbnail: {
      aspectRatio: 1,
      height: null,
      url: "https://d2v80f5yrouhh2.cloudfront.net/EBrAWqoP97vgCzSdnlRKgg/thumbnail.jpg",
      width: null,
    },
  },
  internalID: "661105",
  mediumText:
    "screenprint in colours, 1984, signed in pencil, numbered 48/60 (total edition includes 15 artist's proofs), printed by rupert jasen smith, new york, with the publisher's inkstamp verso, editions schellmann & klüser, munich and new york, on arches aquarelle paper, framed",
  organization: "Sotheby's",
  performance: { mid: "-12%" },
  priceRealized: { cents: 1100000, display: "€11,000", displayUSD: "US$11,806" },
  saleDate: "2022-06-03T12:00:00+02:00",
  title:
    "Details of Renaissance Paintings (Leonardo da Vinci, The Annunciation, 1472) (Feldman & Schellmann II.322)",
  medium: "Painting",
}
const data = [item2, item2]
export const AverageSalePriceRail: React.FC = () => {
  return (
    <>
      <Flex pb={2} px={2}>
        <SectionTitle
          capitalized={false}
          title="Average Sale Price at Auction"
          onPress={() => {
            return
          }}
          mb={1}
        />
        <FlatList
          data={data}
          listKey="average-sale-prices"
          renderItem={(item) => (
            <AverageSalePriceListItem
              estimatedArtwork={item.item}
              showArtistName
              rounded
              onPress={() => {
                return
              }}
            />
          )}
          ItemSeparatorComponent={AverageSalePriceListSeparator}
          style={{ width: useScreenDimensions().width, left: -20 }}
        />
      </Flex>
    </>
  )
}
