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
import { ArtworkCardBottomSheetFooterQuery } from "__generated__/ArtworkCardBottomSheetFooterQuery.graphql"
import {
  ArtworkCardBottomSheetFooter_artwork$data,
  ArtworkCardBottomSheetFooter_artwork$key,
} from "__generated__/ArtworkCardBottomSheetFooter_artwork.graphql"
import { ArtworkCardBottomSheetFooter_me$key } from "__generated__/ArtworkCardBottomSheetFooter_me.graphql"
import { useBottomSheetAnimatedStyles } from "app/Components/ArtworkCard/useBottomSheetAnimatedStyles"
import { Divider } from "app/Components/Bidding/Components/Divider"
import { currentTimerState } from "app/Components/Bidding/Components/Timer"
import { artworkModel, ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkCommercialButtons } from "app/Scenes/Artwork/Components/ArtworkCommercialButtons"
import { ArtworkPrice } from "app/Scenes/Artwork/Components/ArtworkPrice"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import {
  AuctionWebsocketChannelInfo,
  AuctionWebsocketContextProvider,
} from "app/utils/Websockets/auctions/AuctionSocketContext"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface ArtworkCardBottomSheetFooterProps extends BottomSheetFooterProps {
  artwork: ArtworkCardBottomSheetFooter_artwork$key
  me: ArtworkCardBottomSheetFooter_me$key
}

export const ArtworkCardBottomSheetFooter: FC<ArtworkCardBottomSheetFooterProps> = ({
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
  fragment ArtworkCardBottomSheetFooter_artwork on Artwork {
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
  fragment ArtworkCardBottomSheetFooter_me on Me {
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

interface ArtworkCardBottomSheetFooterQueryRendererProps extends BottomSheetFooterProps {
  artworkID: string
}

const artworkCardBottomSheetFooterQuery = graphql`
  query ArtworkCardBottomSheetFooterQuery($id: String!) {
    me {
      ...ArtworkCardBottomSheetFooter_me
    }
    artwork(id: $id) {
      ...ArtworkCardBottomSheetFooter_artwork
    }
  }
`

export const ArtworkCardBottomSheetFooterQueryRenderer: FC<ArtworkCardBottomSheetFooterQueryRendererProps> =
  withSuspense({
    Component: ({ artworkID, ...rest }) => {
      const data = useLazyLoadQuery<ArtworkCardBottomSheetFooterQuery>(
        artworkCardBottomSheetFooterQuery,
        {
          id: artworkID,
        }
      )

      if (!data.artwork || !data.me) {
        return null
      }

      return <ArtworkCardBottomSheetFooter artwork={data.artwork} me={data.me} {...rest} />
    },
    LoadingFallback: (props) => <ArtworkCardBottomSheetFooterSkeleton {...props} />,
    ErrorFallback: (_errorProps, props) => {
      return <ArtworkCardBottomSheetFooterErrorFallback {...props} />
    },
  })

const ArtworkCardBottomSheetFooterErrorFallback: React.FC<
  ArtworkCardBottomSheetFooterQueryRendererProps
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
  artwork: NonNullable<ArtworkCardBottomSheetFooter_artwork$data>
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

export const ArtworkCardBottomSheetFooterSkeleton: FC<BottomSheetFooterProps> = (props) => {
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
