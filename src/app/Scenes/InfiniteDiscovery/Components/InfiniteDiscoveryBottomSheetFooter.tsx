import { ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Flex,
  SimpleMessage,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { BottomSheetFooter, BottomSheetFooterProps } from "@gorhom/bottom-sheet"
import { InfiniteDiscoveryBottomSheetFooterQuery } from "__generated__/InfiniteDiscoveryBottomSheetFooterQuery.graphql"
import {
  InfiniteDiscoveryBottomSheetFooter_artwork$data,
  InfiniteDiscoveryBottomSheetFooter_artwork$key,
} from "__generated__/InfiniteDiscoveryBottomSheetFooter_artwork.graphql"
import { InfiniteDiscoveryBottomSheetFooter_me$key } from "__generated__/InfiniteDiscoveryBottomSheetFooter_me.graphql"
import { Divider } from "app/Components/Bidding/Components/Divider"
import { currentTimerState } from "app/Components/Bidding/Components/Timer"
import { artworkModel, ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkCommercialButtons } from "app/Scenes/Artwork/Components/ArtworkCommercialButtons"
import { ArtworkPrice } from "app/Scenes/Artwork/Components/ArtworkPrice"
import { useBottomSheetAnimatedStyles } from "app/Scenes/InfiniteDiscovery/hooks/useBottomSheetAnimatedStyles"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import {
  AuctionWebsocketChannelInfo,
  AuctionWebsocketContextProvider,
} from "app/utils/Websockets/auctions/AuctionSocketContext"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface InfiniteDiscoveryBottomSheetFooterProps extends BottomSheetFooterProps {
  artwork: InfiniteDiscoveryBottomSheetFooter_artwork$key
  me: InfiniteDiscoveryBottomSheetFooter_me$key
}

export const InfiniteDiscoveryBottomSheetFooter: FC<InfiniteDiscoveryBottomSheetFooterProps> = ({
  artwork: _artwork,
  me: _me,
  ...bottomSheetFooterProps
}) => {
  const { reversedOpacityStyle } = useBottomSheetAnimatedStyles()

  const artwork = useFragment(artworkFragment, _artwork)
  const me = useFragment(meFragment, _me)
  const space = useSpace()

  const { bottom } = useSafeAreaInsets()

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
      style={{
        ...reversedOpacityStyle,
      }}
    >
      <AnalyticsContextProvider
        contextModule={ContextModule.infiniteDiscoveryDrawer}
        contextScreenOwnerType={OwnerType.infiniteDiscoveryArtwork}
        contextScreenOwnerId={artwork.internalID}
        contextScreenOwnerSlug={artwork.slug}
      >
        <Divider />

        <Flex
          py={2}
          px={2}
          gap={1}
          backgroundColor="mono0"
          style={{ paddingBottom: space(2) + bottom }}
        >
          <AuctionWebsocketContextProvider
            channelInfo={socketChannelInfo}
            enabled={websocketEnabled}
          >
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
      </AnalyticsContextProvider>
    </BottomSheetFooter>
  )
}

const artworkFragment = graphql`
  fragment InfiniteDiscoveryBottomSheetFooter_artwork on Artwork {
    ...ArtworkPrice_artwork
    ...ArtworkCommercialButtons_artwork

    internalID
    slug

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
  artworkID: string
}

const infiniteDiscoveryBottomSheetFooterQuery = graphql`
  query InfiniteDiscoveryBottomSheetFooterQuery($id: String!) {
    me {
      ...InfiniteDiscoveryBottomSheetFooter_me
    }
    artwork(id: $id) {
      ...InfiniteDiscoveryBottomSheetFooter_artwork
    }
  }
`

export const InfiniteDiscoveryBottomSheetFooterQueryRenderer: FC<InfiniteDiscoveryBottomSheetFooterQueryRendererProps> =
  withSuspense({
    Component: ({ artworkID, ...rest }) => {
      const data = useLazyLoadQuery<InfiniteDiscoveryBottomSheetFooterQuery>(
        infiniteDiscoveryBottomSheetFooterQuery,
        {
          id: artworkID,
        }
      )

      if (!data.artwork || !data.me) {
        return null
      }

      return <InfiniteDiscoveryBottomSheetFooter artwork={data.artwork} me={data.me} {...rest} />
    },
    LoadingFallback: (props) => <InfiniteDiscoveryBottomSheetFooterSkeleton {...props} />,
    ErrorFallback: (_errorProps, props) => {
      return <InfiniteDiscoveryBottomSheetFooterErrorFallback {...props} />
    },
    disableFadeIn: true,
  })

const InfiniteDiscoveryBottomSheetFooterErrorFallback: React.FC<
  InfiniteDiscoveryBottomSheetFooterQueryRendererProps
> = (props) => {
  const color = useColor()
  const space = useSpace()

  return (
    <BottomSheetFooter
      {...props}
      style={{ paddingBottom: space(2), backgroundColor: color("mono0") }}
    >
      <Divider />
      <Skeleton>
        <Flex p={2}>
          <SimpleMessage m={2}>Cannot load work details.</SimpleMessage>
        </Flex>
      </Skeleton>
    </BottomSheetFooter>
  )
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
      style={{ paddingBottom: bottom, backgroundColor: color("mono0") }}
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
