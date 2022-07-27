import { Sale_sale$data } from "__generated__/Sale_sale.graphql"
import { Sale_viewer$data } from "__generated__/Sale_viewer.graphql"
import { SaleBelowTheFoldNewQuery } from "__generated__/SaleBelowTheFoldNewQuery.graphql"
import {
  AnimatedArtworkFilterButton,
  ArtworkFilterNavigator,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { DEFAULT_NEW_SALE_ARTWORK_SORT } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { AuctionWebsocketContextProvider } from "app/Websockets/auctions/AuctionSocketContext"
import _, { times } from "lodash"
import { Box, Flex, Join, Spacer } from "palette"
import React, { useRef, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { NewSaleLotsListContainer } from "./Components/NewSaleLotsList"
import { COVER_IMAGE_HEIGHT } from "./Components/SaleHeader"

interface Props {
  viewer: Sale_viewer$data
  sale: Sale_sale$data
}

// tslint:disable-next-line:no-empty
const NOOP = () => {}

export const Sale: React.FC<Props> = ({ viewer, sale }) => {
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const artworksRefetchRef = useRef(NOOP)

  const openFilterArtworksModal = () => {
    setFilterArtworkModalVisible(true)
  }

  const closeFilterArtworksModal = () => {
    setFilterArtworkModalVisible(false)
  }

  const scrollToTop = () => {
    console.log("[debug] scrollToTop")
  }

  const websocketEnabled = !!sale.extendedBiddingIntervalMinutes

  return (
    <ArtworkFiltersStoreProvider>
      <AuctionWebsocketContextProvider
        channelInfo={{
          channel: "SalesChannel",
          sale_id: sale.internalID,
        }}
        enabled={websocketEnabled}
      >
        <ProvideScreenTracking info={tracks.screen(sale.internalID, sale.slug)}>
          <NewSaleLotsListContainer
            unfilteredArtworks={viewer.unfilteredArtworks}
            viewer={viewer}
            saleID={sale.internalID}
            saleSlug={sale.slug}
            scrollToTop={scrollToTop}
            artworksRefetchRef={artworksRefetchRef}
          />
          <ArtworkFilterNavigator
            visible={isFilterArtworksModalVisible}
            id={sale.internalID}
            slug={sale.slug}
            mode={FilterModalMode.SaleArtworks}
            exitModal={closeFilterArtworksModal}
            closeModal={closeFilterArtworksModal}
          />
          <AnimatedArtworkFilterButton isVisible onPress={openFilterArtworksModal} />
        </ProvideScreenTracking>
      </AuctionWebsocketContextProvider>
    </ArtworkFiltersStoreProvider>
  )
}

export const tracks = {
  screen: (id: string, slug: string) => {
    return {
      context_screen: Schema.PageNames.Auction,
      context_screen_owner_type: Schema.OwnerEntityTypes.Auction,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
    }
  },
}

const SaleContainer = createFragmentContainer(Sale, {
  sale: graphql`
    fragment Sale_sale on Sale {
      internalID
      slug
      extendedBiddingIntervalMinutes
    }
  `,
  viewer: graphql`
    fragment Sale_viewer on Viewer
    @argumentDefinitions(saleID: { type: "ID" }, input: { type: "FilterArtworksInput" }) {
      unfilteredArtworks: artworksConnection(
        saleID: $saleID
        aggregations: [FOLLOWED_ARTISTS, ARTIST, MEDIUM, TOTAL]
        first: 0
      ) {
        ...NewSaleLotsList_unfilteredArtworks
      }
      ...NewSaleLotsList_viewer @arguments(saleID: $saleID, input: $input)
    }
  `,
})

export const SalePlaceholder: React.FC<{}> = () => (
  <ProvidePlaceholderContext>
    <PlaceholderBox height={COVER_IMAGE_HEIGHT} width="100%" />
    <Flex px={2}>
      <Join separator={<Spacer my={2} />}>
        <Box>
          <PlaceholderText width={200 + Math.random() * 100} marginTop={20} />
          <PlaceholderText width={200 + Math.random() * 100} marginTop={20} />
          <PlaceholderText width={100 + Math.random() * 100} marginTop={5} />
        </Box>
        <Box>
          <PlaceholderText height={20} width={100 + Math.random() * 100} marginBottom={20} />
          <PlaceholderBox height={50} width="100%" />
        </Box>
        <Box>
          <PlaceholderText height={20} width={100 + Math.random() * 100} marginBottom={5} />
          <Flex flexDirection="row" py={2}>
            {times(3).map((index: number) => (
              <Flex key={index} marginRight={1}>
                <PlaceholderBox height={120} width={120} />
                <PlaceholderText marginTop={20} key={index} width={40 + Math.random() * 80} />
              </Flex>
            ))}
          </Flex>
        </Box>
      </Join>
    </Flex>
  </ProvidePlaceholderContext>
)

const SaleScreenBelowNewQuery = graphql`
  query SaleBelowTheFoldNewQuery($saleID: ID, $saleIDString: String!, $input: FilterArtworksInput) {
    sale(id: $saleIDString) {
      ...Sale_sale
    }

    viewer {
      ...Sale_viewer @arguments(saleID: $saleID, input: $input)
    }
  }
`

export const SaleQueryRenderer: React.FC<{
  saleID: string
  environment?: RelayModernEnvironment
}> = ({ saleID, environment }) => {
  return (
    <QueryRenderer<SaleBelowTheFoldNewQuery>
      environment={environment || defaultEnvironment}
      query={SaleScreenBelowNewQuery}
      variables={{
        saleID,
        saleIDString: saleID,
        input: {
          sort: DEFAULT_NEW_SALE_ARTWORK_SORT.paramValue,
        },
      }}
      render={({ props }) => {
        if (props?.sale && props.viewer) {
          return <SaleContainer viewer={props.viewer} sale={props.sale} />
        }

        return (
          <ProvidePlaceholderContext>
            <SalePlaceholder />
          </ProvidePlaceholderContext>
        )
      }}
      cacheConfig={{
        force: true,
      }}
      fetchPolicy="store-and-network"
    />
  )
}
