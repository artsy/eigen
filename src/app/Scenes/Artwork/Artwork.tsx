import { OwnerType } from "@artsy/cohesion"
import { Box, Separator, SpacingUnit, useSpace } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { ArtworkAboveTheFoldQuery } from "__generated__/ArtworkAboveTheFoldQuery.graphql"
import { ArtworkBelowTheFoldQuery } from "__generated__/ArtworkBelowTheFoldQuery.graphql"
import { ArtworkMarkAsRecentlyViewedQuery } from "__generated__/ArtworkMarkAsRecentlyViewedQuery.graphql"
import { Artwork_artworkAboveTheFold$data } from "__generated__/Artwork_artworkAboveTheFold.graphql"
import { Artwork_artworkBelowTheFold$data } from "__generated__/Artwork_artworkBelowTheFold.graphql"
import { Artwork_me$data } from "__generated__/Artwork_me.graphql"
import { AuctionTimerState, currentTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtistSeriesMoreSeriesFragmentContainer as ArtistSeriesMoreSeries } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { ArtworkAuctionCreateAlertHeader } from "app/Scenes/Artwork/ArtworkAuctionCreateAlertHeader"
import { ArtworkDetailsCollectorSignal } from "app/Scenes/Artwork/Components/ArtworkDetailsCollectorSignal"
import { ArtworkDimensionsClassificationAndAuthenticityFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkDimensionsClassificationAndAuthenticity/ArtworkDimensionsClassificationAndAuthenticity"
import { ArtworkErrorScreen } from "app/Scenes/Artwork/Components/ArtworkError"
import { ArtworkPartnerOfferNote } from "app/Scenes/Artwork/Components/ArtworkPartnerOfferNote"
import { ArtworkScreenNavHeader } from "app/Scenes/Artwork/Components/ArtworkScreenNavHeader"
import { AbreviatedArtsyGuarantee } from "app/Scenes/Artwork/Components/PrivateArtwork/AbreviatedArtsyGuarantee"
import { PrivateArtworkExclusiveAccess } from "app/Scenes/Artwork/Components/PrivateArtwork/PrivateArtworkExclusiveAccess"
import { PrivateArtworkMetadata } from "app/Scenes/Artwork/Components/PrivateArtwork/PrivateArtworkMetadata"
import { OfferSubmittedModal } from "app/Scenes/Inbox/Components/Conversations/OfferSubmittedModal"
import { GlobalStore } from "app/store/GlobalStore"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { navigationEvents } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { AboveTheFoldQueryRenderer } from "app/utils/AboveTheFoldQueryRenderer"
import { QAInfoPanel } from "app/utils/QAInfo"
import {
  AuctionWebsocketChannelInfo,
  AuctionWebsocketContextProvider,
} from "app/utils/Websockets/auctions/AuctionSocketContext"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import {
  Environment,
  RelayRefetchProp,
  commitMutation,
  createRefetchContainer,
  graphql,
} from "react-relay"
import { TrackingProp } from "react-tracking"
import usePrevious from "react-use/lib/usePrevious"
import { RelayMockEnvironment } from "relay-test-utils/lib/RelayModernMockEnvironment"
import { ArtworkStore, ArtworkStoreProvider, artworkModel } from "./ArtworkStore"
import { AboutArtistFragmentContainer as AboutArtist } from "./Components/AboutArtist"
import { AboutWorkFragmentContainer as AboutWork } from "./Components/AboutWork"
import { AboveTheFoldPlaceholder } from "./Components/AboveTheFoldArtworkPlaceholder"
import { ArtsyGuarantee } from "./Components/ArtsyGuarantee"
import { ArtworkDetails } from "./Components/ArtworkDetails"
import { ArtworkEditionSetInformationFragmentContainer as ArtworkEditionSetInformation } from "./Components/ArtworkEditionSetInformation"
import { ArtworkHeaderFragmentContainer as ArtworkHeader } from "./Components/ArtworkHeader"
import { ArtworkHistoryFragmentContainer as ArtworkHistory } from "./Components/ArtworkHistory"
import { ArtworkLotDetails } from "./Components/ArtworkLotDetails/ArtworkLotDetails"
import { ArtworkStickyBottomContent } from "./Components/ArtworkStickyBottomContent"
import { ArtworksInSeriesRail } from "./Components/ArtworksInSeriesRail"
import { BelowTheFoldPlaceholder } from "./Components/BelowTheFoldPlaceholder"
import { ContextCardFragmentContainer as ContextCard } from "./Components/ContextCard"
import {
  OtherWorksFragmentContainer as OtherWorks,
  populatedGrids,
} from "./Components/OtherWorks/OtherWorks"
import { PartnerCardFragmentContainer as PartnerCard } from "./Components/PartnerCard"
import { ShippingAndTaxesFragmentContainer } from "./Components/ShippingAndTaxes"

interface ArtworkProps {
  artworkAboveTheFold: Artwork_artworkAboveTheFold$data | null | undefined
  artworkBelowTheFold: Artwork_artworkBelowTheFold$data | null | undefined
  me: Artwork_me$data
  isVisible: boolean
  relay: RelayRefetchProp
  tracking?: TrackingProp
  artworkOfferUnavailable?: boolean
  artworkOfferExpired?: boolean
  // this prop is expected to come from the deep link url params if present
  partner_offer_id?: string
}

export const Artwork: React.FC<ArtworkProps> = (props) => {
  const {
    artworkAboveTheFold,
    artworkBelowTheFold,
    isVisible,
    me,
    relay,
    artworkOfferUnavailable,
    artworkOfferExpired,
  } = props
  const space = useSpace()
  const [refreshing, setRefreshing] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const navigation = useNavigation()

  const isDeepZoomModalVisible = GlobalStore.useAppState(
    (store) => store.devicePrefs.sessionState.isDeepZoomModalVisible
  )

  const { internalID, slug, isInAuction } = artworkAboveTheFold || {}
  const { contextGrids, artistSeriesConnection, artist, context } = artworkBelowTheFold || {}
  const auctionTimerState = ArtworkStore.useStoreState((state) => state.auctionState)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (artworkAboveTheFold) {
          return <ArtworkScreenNavHeader artwork={artworkAboveTheFold} />
        }

        return null
      },
    })
  }, [artworkAboveTheFold, navigation])

  const partnerOffer = extractNodes(me?.partnerOffersConnection)[0]

  const allowExpiredPartnerOffers = useFeatureFlag("AREnableExpiredPartnerOffers")
  const enableAuctionHeaderAlertCTA = useFeatureFlag("AREnableAuctionHeaderAlertCTA")

  const expectedPartnerOfferId = !!props.partner_offer_id

  const partnerOfferUnavailable = expectedPartnerOfferId && !artworkAboveTheFold?.isPurchasable

  const partnerOfferExpiredCondition = allowExpiredPartnerOffers
    ? partnerOffer && partnerOffer.internalID == props.partner_offer_id && !partnerOffer.isActive
    : !partnerOffer || partnerOffer.internalID !== props.partner_offer_id

  const partnerOfferExpired =
    expectedPartnerOfferId &&
    // checking for unavailability to avoid showing double banners
    !partnerOfferUnavailable &&
    partnerOfferExpiredCondition

  const shouldRenderPartner = () => {
    const { sale, partner } = artworkBelowTheFold ?? {}

    if (sale?.isBenefit || sale?.isGalleryAuction) {
      return false
    } else if (partner?.type && partner.type !== "Auction House") {
      return true
    } else {
      return false
    }
  }

  const shouldRenderOtherWorks = () => {
    if (artworkAboveTheFold?.isUnlisted) {
      return false
    }

    const gridsToShow = populatedGrids(contextGrids)

    if (gridsToShow && gridsToShow.length > 0) {
      return true
    } else {
      return false
    }
  }

  const shouldRenderArtworksInArtistSeries = () => {
    if (artworkAboveTheFold?.isUnlisted) {
      return false
    }

    const artistSeries = artistSeriesConnection?.edges?.[0]
    const numArtistSeriesArtworks = artistSeries?.node?.filterArtworksConnection?.edges?.length ?? 0
    return numArtistSeriesArtworks > 0
  }

  const shouldRenderArtistSeriesMoreSeries = () => {
    if (artworkAboveTheFold?.isUnlisted) {
      return false
    }

    return (artist?.artistSeriesConnection?.totalCount ?? 0) > 0
  }

  useEffect(() => {
    markArtworkAsRecentlyViewed()
    navigationEvents.addListener("modalDismissed", handleModalDismissed)

    return () => {
      navigationEvents.removeListener("modalDismissed", handleModalDismissed)
    }
  }, [])

  // This is a hack to make useEffect behave exactly like didComponentUpdate.
  const firstUpdate = useRef(true)
  const previousIsVisible = usePrevious(isVisible)

  useLayoutEffect(() => {
    if (!isVisible || previousIsVisible) {
      return
    }

    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    markArtworkAsRecentlyViewed()
  })

  const onRefresh = (cb?: () => any) => {
    if (refreshing) {
      return
    }

    setRefreshing(true)

    relay.refetch({ artistID: internalID }, null, () => {
      setRefreshing(false)
      cb?.()
    })
  }

  const refetch = (cb?: () => any) => {
    relay.refetch({ artistID: internalID }, null, () => {
      cb?.()
    })
  }

  const handleModalDismissed = () => {
    // If the deep zoom modal is visible, we don't want to refetch the artwork
    // This results in app crash, while testing. This wouldn't occur on Prod
    if (isDeepZoomModalVisible) {
      return
    }
    setFetchingData(true)
    refetch(() => setFetchingData(false))
    return true
  }

  const markArtworkAsRecentlyViewed = () => {
    commitMutation<ArtworkMarkAsRecentlyViewedQuery>(relay.environment, {
      mutation: graphql`
        mutation ArtworkMarkAsRecentlyViewedQuery($input: RecordArtworkViewInput!) {
          recordArtworkView(input: $input) {
            artworkId
          }
        }
      `,
      variables: {
        input: {
          artwork_id: slug || "",
        },
      },
    })
  }

  const sectionsData = (): ArtworkPageSection[] => {
    const sections: ArtworkPageSection[] = []

    if (artworkAboveTheFold) {
      if (enableAuctionHeaderAlertCTA) {
        sections.push({
          key: "auctionHeaderAlertCTA",
          element: <ArtworkAuctionCreateAlertHeader artwork={artworkAboveTheFold} />,
          excludeSeparator: true,
          excludeVerticalMargin: true,
        })
      }

      sections.push({
        key: "header",
        element: (
          <ArtworkHeader
            artwork={artworkAboveTheFold}
            artworkOfferUnavailable={artworkOfferUnavailable || partnerOfferUnavailable}
            artworkOfferExpired={artworkOfferExpired || partnerOfferExpired}
            refetchArtwork={() =>
              relay.refetch({ artworkID: internalID }, null, () => null, { force: true })
            }
          />
        ),
        excludePadding: true,
        excludeSeparator: true,
        excludeVerticalMargin: true,
      })

      if (!artworkAboveTheFold?.isUnlisted) {
        sections.push({
          key: "artworkDetailsCollectorSignal",
          element: <ArtworkDetailsCollectorSignal artwork={artworkAboveTheFold} />,
          excludeSeparator: true,
          excludeVerticalMargin: true,
        })
      }

      sections.push({
        key: "dimensionsClassificationAndAuthenticity",
        element: (
          <ArtworkDimensionsClassificationAndAuthenticityFragmentContainer
            artwork={artworkAboveTheFold}
          />
        ),
        excludeSeparator: true,
        excludeVerticalMargin: true,
      })

      sections.push({
        key: "artworkDetails",
        element: (
          <ArtworkDetails
            artwork={artworkAboveTheFold}
            showReadMore={artworkAboveTheFold.isUnlisted}
          />
        ),
        excludeSeparator:
          !!artworkAboveTheFold.isUnlisted || (artworkAboveTheFold.editionSets ?? []).length > 1,
      })

      if (
        artworkBelowTheFold?.isForSale &&
        !isInAuction &&
        (artworkAboveTheFold.editionSets ?? []).length > 1
      ) {
        sections.push({
          key: "selectEditionSet",
          element: <ArtworkEditionSetInformation artwork={artworkAboveTheFold} />,
          excludeSeparator: true,
          excludeVerticalMargin: !!artworkAboveTheFold.isUnlisted,
        })
      }

      if (!!partnerOffer?.isActive && !!partnerOffer?.note) {
        sections.push({
          key: "partnerOfferNote",
          element: (
            <ArtworkPartnerOfferNote artwork={artworkAboveTheFold} partnerOffer={partnerOffer} />
          ),
          excludeSeparator: true,
        })
      }

      if (artworkAboveTheFold.isUnlisted) {
        if (!!(artworkBelowTheFold?.isForSale && !isInAuction)) {
          sections.push({
            key: "shippingAndTaxes",
            element: (
              <Box mt={4}>
                <ShippingAndTaxesFragmentContainer artwork={artworkBelowTheFold} />
              </Box>
            ),
          })
        }
      }
    }

    if (artworkBelowTheFold && artworkAboveTheFold?.isUnlisted) {
      sections.push({
        key: "exclusiveAccessBanner",
        element: <PrivateArtworkExclusiveAccess artwork={artworkBelowTheFold} />,
        excludeSeparator: true,
      })

      if (!!artworkBelowTheFold?.isEligibleForArtsyGuarantee) {
        sections.push({
          key: "abreviatedArtsyGuarantee",
          element: <AbreviatedArtsyGuarantee />,
        })
      }

      if (shouldRenderPartner()) {
        sections.push({
          key: "partnerCard",
          element: (
            <PartnerCard
              artwork={artworkBelowTheFold}
              me={me}
              showShortContactGallery={
                !!artworkAboveTheFold?.isUnlisted && !!artworkBelowTheFold.partner?.isInquireable
              }
            />
          ),
        })
      }
    }

    if (
      isInAuction &&
      artworkAboveTheFold?.sale &&
      artworkAboveTheFold?.saleArtwork &&
      !artworkAboveTheFold.sale.isClosed
    ) {
      sections.push({
        key: "lotDetailsSection",
        element: (
          <ArtworkLotDetails
            artwork={artworkAboveTheFold}
            auctionState={auctionTimerState as AuctionTimerState}
          />
        ),
      })
    }

    if (!artworkBelowTheFold) {
      sections.push({
        key: "belowTheFoldPlaceholder",
        element: <BelowTheFoldPlaceholder />,
      })

      return sections
    }

    if (!artworkAboveTheFold?.isUnlisted) {
      if (
        artworkBelowTheFold.provenance ||
        artworkBelowTheFold.exhibitionHistory ||
        artworkBelowTheFold.literature
      ) {
        sections.push({
          key: "history",
          element: <ArtworkHistory artwork={artworkBelowTheFold} />,
        })
      }
    }

    if (artworkBelowTheFold.description || artworkBelowTheFold.additionalInformation) {
      sections.push({
        key: "aboutWork",
        element: <AboutWork artwork={artworkBelowTheFold} />,
        excludeSeparator: !!artworkAboveTheFold?.isUnlisted,
      })
    }

    if (artist && artist.biographyBlurb) {
      sections.push({
        key: "aboutArtist",
        element: <AboutArtist artwork={artworkBelowTheFold} />,
        excludeSeparator: !!artworkAboveTheFold?.isUnlisted,
      })
    }

    if (artworkAboveTheFold?.isUnlisted) {
      sections.push({
        key: "privateArtworkMetadata",
        element: <PrivateArtworkMetadata artwork={artworkBelowTheFold} />,
        excludeSeparator: !!artworkAboveTheFold?.isUnlisted,
      })
    }

    if (context && context.__typename === "Sale" && context.isAuction) {
      sections.push({
        key: "contextCard",
        element: <ContextCard artwork={artworkBelowTheFold} />,
      })
    }

    if (!artworkAboveTheFold?.isUnlisted && shouldRenderPartner()) {
      sections.push({
        key: "partnerCard",
        element: (
          <PartnerCard
            shouldShowQuestions={!!artworkBelowTheFold.partner?.isInquireable}
            artwork={artworkBelowTheFold}
            me={me}
            showShortContactGallery={
              !!artworkAboveTheFold?.isUnlisted && !!artworkBelowTheFold.partner?.isInquireable
            }
          />
        ),
      })
    }

    if (!artworkAboveTheFold?.isUnlisted && !!(artworkBelowTheFold.isForSale && !isInAuction)) {
      sections.push({
        key: "shippingAndTaxes",
        element: <ShippingAndTaxesFragmentContainer artwork={artworkBelowTheFold} />,
      })
    }

    if (!artworkAboveTheFold?.isUnlisted && !!artworkBelowTheFold?.isEligibleForArtsyGuarantee) {
      sections.push({
        key: "artsyGuarantee",
        element: <ArtsyGuarantee />,
      })
    }

    if (shouldRenderArtworksInArtistSeries()) {
      sections.push({
        key: "artworksInSeriesRail",
        element: <ArtworksInSeriesRail artwork={artworkBelowTheFold} />,
      })
    }

    if (artworkAboveTheFold && shouldRenderArtistSeriesMoreSeries()) {
      sections.push({
        key: "artistSeriesMoreSeries",
        element: (
          <ArtistSeriesMoreSeries
            contextScreenOwnerId={artworkAboveTheFold.internalID}
            contextScreenOwnerSlug={artworkAboveTheFold.slug}
            contextScreenOwnerType={OwnerType.artwork}
            artist={artist}
            artistSeriesHeader="Series from this artist"
            headerVariant="md"
          />
        ),
      })
    }

    if (shouldRenderOtherWorks()) {
      sections.push({
        key: "otherWorks",
        element: <OtherWorks artwork={artworkBelowTheFold} />,
      })
    }

    return sections
  }

  const QAInfo = () => (
    <QAInfoPanel
      style={{ position: "absolute", top: 200, left: 10, backgroundColor: "grey" }}
      info={[["id", internalID || ""]]}
    />
  )

  if (fetchingData) {
    return (
      <ProvidePlaceholderContext>
        <AboveTheFoldPlaceholder />
      </ProvidePlaceholderContext>
    )
  }

  return (
    <>
      <FlatList<ArtworkPageSection>
        keyboardShouldPersistTaps="handled"
        data={sectionsData()}
        ItemSeparatorComponent={(props) => {
          const { leadingItem: item } = props

          if (item.excludeSeparator) {
            return <Box mt={item.excludeVerticalMargin ? 0 : 4} />
          }

          return (
            <Box mx={2} my={4}>
              <Separator />
            </Box>
          )
        }}
        keyExtractor={({ key }) => key}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: space(4) }}
        renderItem={({ item }) => {
          return (
            <Box px={item.excludePadding ? 0 : 2} mt={item.mt}>
              {item.element}
            </Box>
          )
        }}
      />

      {!!(artworkAboveTheFold && me) && (
        <ArtworkStickyBottomContent
          artwork={artworkAboveTheFold}
          me={me}
          partnerOffer={partnerOffer}
        />
      )}

      <QAInfo />
      <OfferSubmittedModal />
    </>
  )
}

interface ArtworkPageSection {
  key: string
  element: JSX.Element
  excludePadding?: boolean
  excludeSeparator?: boolean
  // use verticalMargin to pass custom spacing between separator and section
  verticalMargin?: SpacingUnit
  excludeVerticalMargin?: boolean
  mt?: SpacingUnit
}

const ArtworkProvidersContainer: React.FC<ArtworkProps> = (props) => {
  const { artworkAboveTheFold, artworkBelowTheFold } = props
  const { isInAuction } = artworkAboveTheFold || {}
  const { isPreview, isClosed, liveStartAt } = artworkAboveTheFold?.sale ?? {}
  const websocketEnabled = !!artworkBelowTheFold?.sale?.extendedBiddingIntervalMinutes

  const getInitialAuctionTimerState = () => {
    if (isInAuction) {
      return currentTimerState({
        isPreview: isPreview || undefined,
        isClosed: isClosed || undefined,
        liveStartsAt: liveStartAt || undefined,
      })
    }
    return null
  }

  const trackingInfo: Schema.PageView = {
    context_screen: Schema.PageNames.ArtworkPage,
    context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
    context_screen_owner_slug: artworkAboveTheFold?.slug,
    context_screen_owner_id: artworkAboveTheFold?.internalID,
    // @ts-ignore
    availability: artworkAboveTheFold?.availability,
    acquireable: artworkAboveTheFold?.isAcquireable,
    inquireable: artworkAboveTheFold?.isInquireable,
    offerable: artworkAboveTheFold?.isOfferable,
    biddable: artworkAboveTheFold?.isBiddable,
    visibility_level: artworkAboveTheFold?.visibilityLevel,
    price_display: artworkAboveTheFold?.saleMessage,
  }

  const socketChannelInfo: AuctionWebsocketChannelInfo = {
    channel: "SalesChannel",
    sale_id: artworkAboveTheFold?.sale?.internalID,
  }

  return (
    <ProvideScreenTracking info={trackingInfo}>
      <AnalyticsContextProvider
        contextScreenOwnerId={artworkAboveTheFold?.internalID}
        contextScreenOwnerSlug={artworkAboveTheFold?.slug}
        contextScreenOwnerType={OwnerType.artwork}
      >
        <AuctionWebsocketContextProvider channelInfo={socketChannelInfo} enabled={websocketEnabled}>
          <ArtworkStoreProvider
            runtimeModel={{
              ...artworkModel,
              auctionState: getInitialAuctionTimerState(),
            }}
          >
            <Artwork {...props} />
          </ArtworkStoreProvider>
        </AuctionWebsocketContextProvider>
      </AnalyticsContextProvider>
    </ProvideScreenTracking>
  )
}

export const ArtworkContainer = createRefetchContainer(
  ArtworkProvidersContainer,
  {
    artworkAboveTheFold: graphql`
      fragment Artwork_artworkAboveTheFold on Artwork {
        ...ArtworkAuctionCreateAlertHeader_artwork
        ...ArtworkScreenNavHeader_artwork
        ...ArtworkHeader_artwork
        ...ArtworkLotDetails_artwork
        ...ArtworkStickyBottomContent_artwork
        ...ArtworkDetails_artwork
        ...ArtworkEditionSetInformation_artwork
        ...ArtworkPartnerOfferNote_artwork
        ...ArtworkPrice_artwork
        ...ArtworkDimensionsClassificationAndAuthenticity_artwork
        ...ArtworkDetailsCollectorSignal_artwork
        slug
        internalID
        isAcquireable
        isOfferable
        isBiddable
        isInquireable
        isInAuction
        isPurchasable
        isUnlisted
        availability
        visibilityLevel
        sale {
          internalID
          isClosed
          isPreview
          liveStartAt
        }
        saleMessage
        saleArtwork {
          internalID
        }
        editionSets {
          internalID
        }
      }
    `,
    artworkBelowTheFold: graphql`
      fragment Artwork_artworkBelowTheFold on Artwork {
        ...PrivateArtworkExclusiveAccess_artwork
        ...PartnerCard_artwork
        ...AboutWork_artwork
        ...OtherWorks_artwork
        ...AboutArtist_artwork
        ...ContextCard_artwork
        ...ArtworkHistory_artwork
        ...ArtworksInSeriesRail_artwork
        ...ShippingAndTaxes_artwork
        ...PrivateArtworkMetadata_artwork
        additionalInformation
        description
        provenance
        exhibitionHistory
        literature
        isForSale
        partner(shallow: true) {
          type
          isInquireable
        }
        artist(shallow: true) {
          biographyBlurb {
            text
          }
          artistSeriesConnection(first: 4) {
            totalCount
          }
          ...ArtistSeriesMoreSeries_artist
        }
        sale {
          isBenefit
          isGalleryAuction
          extendedBiddingIntervalMinutes
        }
        context {
          __typename
          ... on Sale {
            isAuction
          }
        }
        contextGrids {
          artworks: artworksConnection(first: 6) {
            edges {
              node {
                id
              }
            }
          }
        }
        artistSeriesConnection(first: 1) {
          edges {
            node {
              filterArtworksConnection(first: 20, input: { sort: "-decayed_merch" }) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
        isEligibleForArtsyGuarantee
      }
    `,
    me: graphql`
      fragment Artwork_me on Me @argumentDefinitions(artworkID: { type: "String!" }) {
        ...ArtworkCommercialButtons_me
        ...useSendInquiry_me
        ...MyProfileEditModal_me
        ...BidButton_me
        partnerOffersConnection(artworkID: $artworkID, first: 1) {
          edges {
            node {
              internalID
              note
              isActive
              ...ArtworkStickyBottomContent_partnerOffer
              ...ArtworkPartnerOfferNote_partnerOffer
              ...ArtworkPrice_partnerOffer
            }
          }
        }
      }
    `,
  },
  graphql`
    query ArtworkRefetchQuery($artworkID: String!) {
      artworkResult(id: $artworkID) {
        ...Artwork_artworkAboveTheFold
        ...Artwork_artworkBelowTheFold
      }
    }
  `
)

export const ArtworkScreenQuery = graphql`
  query ArtworkAboveTheFoldQuery($artworkID: String!) {
    artworkResult(id: $artworkID) @principalField {
      __typename
      ...Artwork_artworkAboveTheFold
    }
    me {
      ...Artwork_me @arguments(artworkID: $artworkID)
    }
  }
`

interface ArtworkScreenProps {
  artworkID: string
  isVisible: boolean
  environment?: Environment | RelayMockEnvironment
  tracking?: TrackingProp
}

export const ArtworkScreen: React.FC<ArtworkScreenProps> = ({
  artworkID,
  environment,
  ...others
}) => {
  return (
    <AboveTheFoldQueryRenderer<ArtworkAboveTheFoldQuery, ArtworkBelowTheFoldQuery>
      environment={environment || getRelayEnvironment()}
      above={{
        query: ArtworkScreenQuery,
        variables: { artworkID },
      }}
      below={{
        query: graphql`
          query ArtworkBelowTheFoldQuery($artworkID: String!) {
            artworkResult(id: $artworkID) {
              __typename
              ...Artwork_artworkBelowTheFold
            }
          }
        `,
        variables: { artworkID },
      }}
      fallback={() => <ArtworkErrorScreen />}
      render={{
        renderPlaceholder: () => <AboveTheFoldPlaceholder artworkID={artworkID} />,
        renderComponent: ({ above, below }) => {
          if (
            // Make sure that the artwork exists
            above.artworkResult?.__typename === "Artwork" &&
            above.me
          ) {
            return (
              <ArtworkContainer
                {...others}
                artworkAboveTheFold={above.artworkResult}
                artworkBelowTheFold={below?.artworkResult ?? null}
                me={above.me}
              />
            )
          }
          return <ArtworkErrorScreen />
        },
      }}
      fetchPolicy="store-and-network"
    />
  )
}
