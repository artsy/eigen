import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { AuctionResultForYouListItem } from "lib/Scenes/AuctionResultForYou/AuctionResultForYouListItem"
import { Flex } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { RailScrollProps } from "./types"

const mockAuctionResults = [
  {
    currency: "USD",
    dateText: "2006",
    id: "QXVjdGlvblJlc3VsdDozMzAwMDY=",
    internalID: "330006",
    images: {
      thumbnail: {
        url: "https://d2v80f5yrouhh2.cloudfront.net/4V-XxYOjIKYMJt1CK63rCA/thumbnail.jpg",
        height: null,
        width: null,
        aspectRatio: 1,
      },
    },
    estimate: {
      low: 5000000,
    },
    mediumText: "digital pigment print in colors, on wove paper",
    organization: "Christie's",
    boughtIn: false,
    performance: {
      mid: "4%",
    },
    priceRealized: {
      display: "$62,500",
      cents: 6250000,
    },
    saleDate: "2021-04-16T03:00:00+03:00",
    title: "Napalm (Can't Beat the Feeling), from In the Darkest Hour There May Be Light",
  },
  {
    currency: "GBP",
    dateText: "1905",
    id: "QXVjdGlvblJlc3VsdDozMjQyODE=",
    internalID: "324281",
    images: {
      thumbnail: {
        url: "https://d2v80f5yrouhh2.cloudfront.net/kJ3fvGeVUGDUpsyTjMKY5g/thumbnail.jpg",
        height: null,
        width: null,
        aspectRatio: 1,
      },
    },
    estimate: {
      low: 4000000,
    },
    mediumText: "screenprint in colours, on wove paper",
    organization: "Christie's",
    boughtIn: false,
    performance: {
      mid: "38%",
    },
    priceRealized: {
      display: "£68,750",
      cents: 6875000,
    },
    saleDate: "2021-04-01T03:00:00+03:00",
    title: "Napalm",
  },
  {
    currency: "GBP",
    dateText: "2002",
    id: "QXVjdGlvblJlc3VsdDozMjM0OTE=",
    internalID: "323491",
    images: {
      thumbnail: {
        url: "https://d2v80f5yrouhh2.cloudfront.net/h5FmZDNX7NsABDszxsFRGQ/thumbnail.jpg",
        height: null,
        width: null,
        aspectRatio: 1,
      },
    },
    estimate: {
      low: 40000000,
    },
    mediumText: "spray paint on canvas",
    organization: "Sotheby's",
    boughtIn: false,
    performance: {
      mid: "72%",
    },
    priceRealized: {
      display: "£862,000",
      cents: 86200000,
    },
    saleDate: "2021-04-07T03:00:00+03:00",
    title: "Laugh Now",
  },
  {
    currency: "USD",
    dateText: "2002",
    id: "QXVjdGlvblJlc3VsdDozMjk0OTc=",
    internalID: "329497",
    images: {
      thumbnail: {
        url: "https://d2v80f5yrouhh2.cloudfront.net/azk0ha0RO_Yhp6eyC9G6dg/thumbnail.jpg",
        height: null,
        width: null,
        aspectRatio: 1,
      },
    },
    estimate: {
      low: 200000000,
    },
    mediumText: "spray paint and emulsion on paperboard",
    organization: "Christie's",
    boughtIn: false,
    performance: {
      mid: "-17%",
    },
    priceRealized: {
      display: "$2,070,000",
      cents: 207000000,
    },
    saleDate: "2021-05-11T03:00:00+03:00",
    title: "Laugh Now But One Day We'll Be In Charge",
  },
]

const AuctionResultsRail: React.FC<RailScrollProps> = (props) => {
  const listRef = useRef<FlatList<any>>()

  useImperativeHandle(props.scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  return (
    <View>
      <Flex pl="2" pr="2">
        <SectionTitle title="Auction Results for You" />
      </Flex>

      <CardRailFlatList
        listRef={listRef}
        data={mockAuctionResults}
        keyExtractor={(_, index) => String(index)}
        horizontal={false}
        initialNumToRender={3}
        renderItem={({ item: result, index }) => {
          if (index >= 3) {
            return <></>
          }

          return (
            <AuctionResultForYouListItem
              auctionResult={result}
              onPress={() => {
                // uncomment after implementing AuctionResults query
                // const tapEvent = HomeAnalytics.collectionThumbnailTapEvent(result?.slug, index)
                // if (tapEvent) {
                //   tracking.trackEvent(tapEvent)
                // }
                navigate(`/auction-result-for-you`)
                // Here the auction-highlights is mocked slug for the navigation to work
                // ToDo: Refactor this part
                // navigate(`/auction-result-for-you/${result.slug}`)
              }}
            />
          )
        }}
      />
    </View>
  )
}

export const ActionResultsRailFragmentContainer = createFragmentContainer(AuctionResultsRail, {
  // Replace Query after implementing AuctionResults Query
  collectionsModule: graphql`
    fragment AuctionResultsRail_collectionsModule on HomePageMarketingCollectionsModule {
      results {
        title
        slug
        artworksConnection(first: 3) {
          counts {
            total
          }
          edges {
            node {
              image {
                url(version: "large")
              }
            }
          }
        }
      }
    }
  `,
})
