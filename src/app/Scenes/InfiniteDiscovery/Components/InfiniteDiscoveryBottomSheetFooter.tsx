import { Flex, Skeleton, SkeletonBox, SkeletonText, useColor } from "@artsy/palette-mobile"
import { BottomSheetFooter, BottomSheetFooterProps } from "@gorhom/bottom-sheet"
import {
  InfiniteDiscoveryBottomSheetFooter_artwork$data,
  InfiniteDiscoveryBottomSheetFooter_artwork$key,
} from "__generated__/InfiniteDiscoveryBottomSheetFooter_artwork.graphql"
import { InfiniteDiscoveryBottomSheetFooter_me$key } from "__generated__/InfiniteDiscoveryBottomSheetFooter_me.graphql"
import { InfiniteDiscoveryBottomSheetTabsQuery } from "__generated__/InfiniteDiscoveryBottomSheetTabsQuery.graphql"
import { Divider } from "app/Components/Bidding/Components/Divider"
import { currentTimerState } from "app/Components/Bidding/Components/Timer"
import { artworkModel, ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkCommercialButtons } from "app/Scenes/Artwork/Components/ArtworkCommercialButtons"
import { ArtworkPrice } from "app/Scenes/Artwork/Components/ArtworkPrice"
import { aboutTheWorkQuery } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import {
  AuctionWebsocketChannelInfo,
  AuctionWebsocketContextProvider,
} from "app/utils/Websockets/auctions/AuctionSocketContext"
import { FC } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, PreloadedQuery, useFragment, usePreloadedQuery } from "react-relay"

interface InfiniteDiscoveryBottomSheetFooterProps extends BottomSheetFooterProps {
  artwork: InfiniteDiscoveryBottomSheetFooter_artwork$key
  me: InfiniteDiscoveryBottomSheetFooter_me$key
}

export const InfiniteDiscoveryBottomSheetFooter: FC<InfiniteDiscoveryBottomSheetFooterProps> = ({
  artwork: _artwork,
  me: _me,
  ...bottomSheetFooterProps
}) => {
  const { bottom } = useSafeAreaInsets()
  const color = useColor()

  const artwork = useFragment(artworkFragment, _artwork)
  const me = useFragment(meFragment, _me)

  if (!artwork || !me) {
    return null
  }

  const partnerOffer = me.partnerOffersConnection?.edges?.[0]?.node

  const initialAuctionTimer = getInitialAuctionTimerState(artwork)
  const socketChannelInfo: AuctionWebsocketChannelInfo = {
    channel: "SalesChannel",
    sale_id: artwork.sale?.internalID,
  }
  const websocketEnabled = !!artwork.sale?.extendedBiddingIntervalMinutes

  return (
    <BottomSheetFooter
      {...bottomSheetFooterProps}
      style={{ paddingBottom: bottom, backgroundColor: color("white100") }}
    >
      <Divider />

      <Flex p={2} gap={1}>
        <AuctionWebsocketContextProvider channelInfo={socketChannelInfo} enabled={websocketEnabled}>
          <ArtworkStoreProvider
            runtimeModel={{
              ...artworkModel,
              auctionState: initialAuctionTimer,
            }}
          >
            <ArtworkPrice artwork={artwork} partnerOffer={partnerOffer as any} />
            <ArtworkCommercialButtons
              artwork={artwork}
              me={me}
              partnerOffer={partnerOffer as any}
            />
          </ArtworkStoreProvider>
        </AuctionWebsocketContextProvider>
      </Flex>
    </BottomSheetFooter>
  )
}

const artworkFragment = graphql`
  fragment InfiniteDiscoveryBottomSheetFooter_artwork on Artwork {
    ...ArtworkPrice_artwork
    ...ArtworkCommercialButtons_artwork

    isInAuction
    sale {
      internalID
      isPreview
      isClosed
      liveStartAt
      extendedBiddingIntervalMinutes
    }
  }
`

const meFragment = graphql`
  fragment InfiniteDiscoveryBottomSheetFooter_me on Me {
    ...ArtworkCommercialButtons_me
    ...MyProfileEditModal_me
    ...useSendInquiry_me
    ...BidButton_me

    partnerOffersConnection {
      edges {
        node {
          ...ArtworkPrice_partnerOffer
          ...ArtworkCommercialButtons_partnerOffer
        }
      }
    }
  }
`

interface InfiniteDiscoveryBottomSheetFooterQueryRendererProps extends BottomSheetFooterProps {
  queryRef: PreloadedQuery<InfiniteDiscoveryBottomSheetTabsQuery>
}

export const InfiniteDiscoveryBottomSheetFooterQueryRenderer: FC<
  InfiniteDiscoveryBottomSheetFooterQueryRendererProps
> = ({ queryRef, ...rest }) => {
  const data = usePreloadedQuery(aboutTheWorkQuery, queryRef)

  if (!data.artwork || !data.me) {
    return <InfiniteDiscoveryBottomSheetFooterSkeleton {...rest} />
  }

  return <InfiniteDiscoveryBottomSheetFooter artwork={data.artwork} me={data.me} {...rest} />
}

const getInitialAuctionTimerState = (
  artwork: NonNullable<InfiniteDiscoveryBottomSheetFooter_artwork$data>
) => {
  if (!artwork.isInAuction) {
    return null
  }

  const sale = artwork.sale

  return currentTimerState({
    isPreview: sale?.isPreview || undefined,
    isClosed: sale?.isClosed || undefined,
    liveStartsAt: sale?.liveStartAt || undefined,
  })
}

export const InfiniteDiscoveryBottomSheetFooterSkeleton: FC<BottomSheetFooterProps> = (props) => {
  const { bottom } = useSafeAreaInsets()
  const color = useColor()
  return (
    <BottomSheetFooter
      {...props}
      style={{ paddingBottom: bottom, backgroundColor: color("white100") }}
    >
      <Divider />
      <Skeleton>
        <Flex p={2} gap={1}>
          <SkeletonText variant="lg-display">$1000.00</SkeletonText>

          <Flex flexDirection="row" alignItems="center" gap={1}>
            <SkeletonBox height={50} width="100%" />
          </Flex>
        </Flex>
      </Skeleton>
    </BottomSheetFooter>
  )
}
