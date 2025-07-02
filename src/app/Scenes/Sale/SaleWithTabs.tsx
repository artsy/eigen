import { ShareIcon } from "@artsy/icons/native"
import { Screen, Tabs } from "@artsy/palette-mobile"
import { SaleArtworks_viewer$key } from "__generated__/SaleArtworks_viewer.graphql"
import { SaleWithTabsQuery } from "__generated__/SaleWithTabsQuery.graphql"
import { SaleWithTabs_me$key } from "__generated__/SaleWithTabs_me.graphql"
import { SaleWithTabs_sale$key } from "__generated__/SaleWithTabs_sale.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useToast } from "app/Components/Toast/toastHook"
import { SaleArtworks } from "app/Scenes/Sale/Components/SaleArtworks"
import { SaleOverview } from "app/Scenes/Sale/Components/SaleOverview"
import { SaleTabHeader } from "app/Scenes/Sale/Components/SaleTabHeader"
import { goBack } from "app/system/navigation/navigate"
import { AuctionWebsocketContextProvider } from "app/utils/Websockets/auctions/AuctionSocketContext"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { FC } from "react"
import { TouchableOpacity } from "react-native"
import RNShare from "react-native-share"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface SaleWithTabsProps {
  me: SaleWithTabs_me$key
  sale: SaleWithTabs_sale$key
  viewer: SaleArtworks_viewer$key
}

export const SaleWithTabs: FC<SaleWithTabsProps> = ({ me, sale, viewer }) => {
  const saleData = useFragment(saleFragment, sale)
  const meData = useFragment(meFragment, me)
  const toast = useToast()

  if (!saleData || !meData) {
    return null
  }

  const handleSharePress = async () => {
    try {
      const url = `${saleData.href}?utm_content=auction-share`
      const message = `View ${saleData.name} on Artsy`

      await RNShare.open({
        title: saleData.name || "",
        message: message + "\n" + url,
        failOnCancel: true,
      })
      toast.show("Copied to Clipboard", "middle", { Icon: ShareIcon })
    } catch (error) {
      if (typeof error === "string" && error.includes("User did not share")) {
        console.error("Sale.tsx", error)
      }
    }
  }

  const totalSaleArtworks = saleData.promotedSale?.saleArtworksCount?.totalCount ?? 0
  const totalLotsByFollowedArtists = meData.lotsCount?.counts.total ?? 0
  console.log("cb::aha", {
    totalLotsByFollowedArtists,
    totalSaleArtworks,
    meData,
    saleData,
  })
  const showOverview = totalLotsByFollowedArtists > 0 || totalSaleArtworks > 0

  return (
    <Screen>
      <Screen.AnimatedHeader
        title={saleData.name}
        onBack={goBack}
        rightElements={
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Share Fair"
            onPress={() => {
              handleSharePress()
            }}
          >
            <ShareIcon width={24} height={24} />
          </TouchableOpacity>
        }
      />
      <Screen.Body fullwidth>
        <Tabs.TabsWithHeader
          title={saleData.name}
          BelowTitleHeaderComponent={() => <SaleTabHeader sale={saleData} me={meData} />}
          showLargeHeaderText={false}
          hideScreen
        >
          <Tabs.Tab name="Artworks" label="Artworks">
            <Tabs.Lazy>
              <SaleArtworks viewer={viewer} />
            </Tabs.Lazy>
          </Tabs.Tab>
          {!!showOverview ? (
            <Tabs.Tab name="Overview" label="Overview">
              <Tabs.Lazy>
                <SaleOverview me={meData} sale={saleData} />
              </Tabs.Lazy>
            </Tabs.Tab>
          ) : null}
        </Tabs.TabsWithHeader>
      </Screen.Body>
    </Screen>
  )
}

const saleFragment = graphql`
  fragment SaleWithTabs_sale on Sale {
    ...SaleTabHeader_sale
    ...NewBuyNowArtworksRail_sale

    name @required(action: NONE)
    href @required(action: NONE)
    internalID @required(action: NONE)
    slug @required(action: NONE)

    promotedSale {
      description
      saleArtworksCount: artworksConnection(first: 1) {
        totalCount
      }
    }
  }
`

const meFragment = graphql`
  fragment SaleWithTabs_me on Me
  @argumentDefinitions(saleID: { type: "ID!" }, saleIDString: { type: "String!" }) {
    ...SaleArtworksRail_me @arguments(saleID: $saleID)
    ...SaleActiveBids_me @arguments(saleID: $saleIDString)
    ...RegisterToBidButton_me @arguments(saleID: $saleIDString)
    ...SaleArtworksRail_me @arguments(saleID: $saleID)

    lotsCount: lotsByFollowedArtistsConnection(
      first: 1
      saleID: $saleID
      includeArtworksByFollowedArtists: true
    ) {
      counts @required(action: NONE) {
        total
      }
    }
  }
`

const query = graphql`
  # TOFIX: MP has inconsistent ID and String types for saleID
  query SaleWithTabsQuery($saleID: ID!, $saleIDString: String!) {
    me {
      ...SaleWithTabs_me @arguments(saleID: $saleID, saleIDString: $saleIDString)
    }
    viewer {
      ...SaleArtworks_viewer @arguments(saleID: $saleID, saleIDString: $saleIDString)
    }
    sale(id: $saleIDString) {
      ...SaleWithTabs_sale

      extendedBiddingIntervalMinutes
      internalID
      slug
    }
  }
`

export const SaleWithTabsQueryRenderer: FC<{ saleID: string }> = ({ saleID }) => {
  const data = useLazyLoadQuery<SaleWithTabsQuery>(query, { saleID, saleIDString: saleID })

  if (!data.viewer || !data.sale || !data.me) {
    return null
  }

  const websocketEnabled = !!data.sale.extendedBiddingIntervalMinutes

  return (
    <ArtworkFiltersStoreProvider>
      <AuctionWebsocketContextProvider
        channelInfo={{
          channel: "SalesChannel",
          sale_id: data.sale.internalID,
        }}
        enabled={websocketEnabled}
      >
        <ProvideScreenTracking info={tracks.screen(data.sale.internalID, data.sale.slug)}>
          <SaleWithTabs viewer={data.viewer} sale={data.sale} me={data.me} />
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
