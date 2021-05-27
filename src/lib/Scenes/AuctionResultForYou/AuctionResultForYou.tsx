import { AuctionResultForYouQuery } from "__generated__/AuctionResultForYouQuery.graphql"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { LinkText } from "lib/Components/Text/LinkText"
import { Fonts } from "lib/data/fonts"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import moment from "moment"
import { Flex, Sans, Separator, Text } from "palette"
import React from "react"
import { Dimensions, SectionList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Tab } from "../Favorites/Favorites"
import { AuctionResultForYouListItem } from "./AuctionResultForYouListItem"

const mockSectionAuctionResults = [
  {
    title: "2021-04-16T03:00:00+03:00",
    data: [
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
    ],
  },
  {
    title: "2021-05-11T03:00:00+03:00",
    data: [
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
    ],
  },
]

export const AuctionResultForYou: React.FC = () => (
  <PageWithSimpleHeader title="Auction Results for You">
    <ArtworkFiltersStoreProvider>
      <Sans size="3" textAlign="left" color="black60" style={{ marginHorizontal: 20, marginVertical: 17 }}>
        The latest auction results for the {""}
        <LinkText onPress={() => navigate("/favorites", { passProps: { initialTab: Tab.artists } })}>
          artists you follow
        </LinkText>
        . You can also look up more auction results on the insights tab on any artist’s page.
      </Sans>
      <SectionList
        sections={mockSectionAuctionResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AuctionResultForYouListItem auctionResult={item} onPress={() => {}} />} // Add onPress action after implementing AuctionResults Query
        renderSectionHeader={({ section: { title } }) => {
          let date = new Date(title)
          let sectionMounth = moment(date).format("MMMM")

          return (
            <Text
              textAlign="left"
              color="black"
              style={{ fontFamily: Fonts.Unica77LLRegular, fontSize: 18, marginLeft: 20 }}
            >
              {sectionMounth}
            </Text>
          )
        }}
        ItemSeparatorComponent={() => (
          <Flex px={2}>
            <Separator />
          </Flex>
        )}
        style={{ width: useScreenDimensions().width }}
      />
    </ArtworkFiltersStoreProvider>
  </PageWithSimpleHeader>
)

export const AuctionResultForYouContainer = createFragmentContainer(AuctionResultForYou, {
  // Replace Query after implementing AuctionResults Query
  collection: graphql`
    fragment AuctionResultForYou_collection on MarketingCollection
    @argumentDefinitions(screenWidth: { type: "Int", defaultValue: 500 }) {
      id
      slug
      isDepartment
      ...CollectionHeader_collection
      ...CollectionArtworks_collection @arguments(input: { sort: "-decayed_merch", dimensionRange: "*-*" })
      ...FeaturedArtists_collection
      ...CollectionHubsRails_collection

      linkedCollections {
        ...CollectionHubsRails_linkedCollections
      }
    }
  `,
})

interface AuctionResultForYouRendererProps {
  collectionID: string
}

export const AuctionResultForYouQueryRenderer: React.FC<AuctionResultForYouRendererProps> = ({
  collectionID = "auction-highlights",
}) => (
  // Replace Query after implementing AuctionResults Query
  <QueryRenderer<AuctionResultForYouQuery>
    environment={defaultEnvironment}
    query={graphql`
      query AuctionResultForYouQuery($collectionID: String!, $screenWidth: Int) {
        collection: marketingCollection(slug: $collectionID) {
          ...AuctionResultForYou_collection @arguments(screenWidth: $screenWidth)
        }
      }
    `}
    variables={{
      collectionID,
      screenWidth: Dimensions.get("screen").width,
    }}
    cacheConfig={{
      force: true,
    }}
    render={renderWithLoadProgress(AuctionResultForYouContainer)}
  />
)
