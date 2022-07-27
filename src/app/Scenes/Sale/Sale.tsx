import { Sale_sale$key } from "__generated__/Sale_sale.graphql"
import { Sale_viewer$key } from "__generated__/Sale_viewer.graphql"
import { SaleBelowTheFoldNewQuery } from "__generated__/SaleBelowTheFoldNewQuery.graphql"
import {
  AnimatedArtworkFilterButton,
  ArtworkFilterNavigator,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { DEFAULT_NEW_SALE_ARTWORK_SORT } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { AuctionWebsocketContextProvider } from "app/Websockets/auctions/AuctionSocketContext"
import React, { useState } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { NewSaleLotsList, NewSaleLotsListContainer } from "./Components/NewSaleLotsList"

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

export const SaleQueryRenderer: React.FC<{
  saleID: string
  environment?: RelayModernEnvironment
}> = ({ saleID }) => {
  const data = useLazyLoadQuery<SaleBelowTheFoldNewQuery>(
    SaleScreenBelowNewQuery,
    {
      saleID,
      saleIDString: saleID,
    },
    {
      fetchPolicy: "store-and-network",
    }
  )
  const sale = useFragment<Sale_sale$key>(saleFragment, data.sale)
  const viewer = useFragment<Sale_viewer$key>(viewerFragment, data.viewer)

  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const openFilterArtworksModal = () => {
    setFilterArtworkModalVisible(true)
  }

  const closeFilterArtworksModal = () => {
    setFilterArtworkModalVisible(false)
  }

  if (!sale || !viewer) {
    // Display loading placeholder
    return null
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
            unfilteredArtworks={viewer.unfilteredArtworks!}
            saleID={sale.internalID}
            saleSlug={sale.slug}
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

const SaleScreenBelowNewQuery = graphql`
  query SaleBelowTheFoldNewQuery($saleID: ID, $saleIDString: String!) {
    sale(id: $saleIDString) {
      ...Sale_sale
    }
    viewer {
      ...Sale_viewer @arguments(saleID: $saleID)
    }
  }
`

const saleFragment = graphql`
  fragment Sale_sale on Sale {
    internalID
    slug
    extendedBiddingIntervalMinutes
  }
`

const viewerFragment = graphql`
  fragment Sale_viewer on Viewer @argumentDefinitions(saleID: { type: "ID" }) {
    unfilteredArtworks: artworksConnection(
      saleID: $saleID
      aggregations: [FOLLOWED_ARTISTS, ARTIST, MEDIUM, TOTAL]
      first: 0
    ) {
      ...NewSaleLotsList_unfilteredArtworks
    }
  }
`
