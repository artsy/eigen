import { OwnerType } from "@artsy/cohesion"
import { Artwork_artworkAboveTheFold$data } from "__generated__/Artwork_artworkAboveTheFold.graphql"
import { Artwork_artworkBelowTheFold$data } from "__generated__/Artwork_artworkBelowTheFold.graphql"
import { Artwork_me$data } from "__generated__/Artwork_me.graphql"
import { ArtworkAboveTheFoldQuery } from "__generated__/ArtworkAboveTheFoldQuery.graphql"
import { ArtworkBelowTheFoldQuery } from "__generated__/ArtworkBelowTheFoldQuery.graphql"
import { ArtworkMarkAsRecentlyViewedQuery } from "__generated__/ArtworkMarkAsRecentlyViewedQuery.graphql"
import { AuctionTimerState, currentTimerState } from "app/Components/Bidding/Components/Timer"
import { RetryErrorBoundaryLegacy } from "app/Components/RetryErrorBoundary"
import { navigationEvents } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { ArtistSeriesMoreSeriesFragmentContainer as ArtistSeriesMoreSeries } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { useFeatureFlag } from "app/store/GlobalStore"
import { AboveTheFoldQueryRenderer } from "app/utils/AboveTheFoldQueryRenderer"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { QAInfoPanel } from "app/utils/QAInfo"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { AuctionWebsocketContextProvider } from "app/Websockets/auctions/AuctionSocketContext"
import { isEmpty } from "lodash"
import { Box, Separator } from "palette"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { commitMutation, createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { TrackingProp } from "react-tracking"
import usePrevious from "react-use/lib/usePrevious"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { ResponsiveValue } from "styled-system"
import { OfferSubmittedModal } from "../Inbox/Components/Conversations/OfferSubmittedModal"
import { AboutArtistFragmentContainer as AboutArtist } from "./Components/AboutArtist"
import { AboutWorkFragmentContainer as AboutWork } from "./Components/AboutWork"
import { AboveTheFoldPlaceholder } from "./Components/AboveTheFoldArtworkPlaceholder"
import { ArtsyGuarantee } from "./Components/ArtsyGuarantee"
import { ArtworkConsignments } from "./Components/ArtworkConsignments"
import { ArtworkDetails } from "./Components/ArtworkDetails"
import { FaqAndSpecialistSectionFragmentContainer as FaqAndSpecialistSection } from "./Components/ArtworkExtraLinks/FaqAndSpecialistSection"
import { ArtworkHeaderFragmentContainer as ArtworkHeader } from "./Components/ArtworkHeader"
import { ArtworkHistoryFragmentContainer as ArtworkHistory } from "./Components/ArtworkHistory"
import { ArtworkLotDetails } from "./Components/ArtworkLotDetails/ArtworkLotDetails"
import { ArtworksInSeriesRail } from "./Components/ArtworksInSeriesRail"
import { BelowTheFoldPlaceholder } from "./Components/BelowTheFoldPlaceholder"
import { CommercialInformationFragmentContainer as CommercialInformation } from "./Components/CommercialInformation"
import { ContextCardFragmentContainer as ContextCard } from "./Components/ContextCard"
import { CreateArtworkAlertSectionFragmentContainer as CreateArtworkAlertSection } from "./Components/CreateArtworkAlertSection"
import {
  OtherWorksFragmentContainer as OtherWorks,
  populatedGrids,
} from "./Components/OtherWorks/OtherWorks"
import { PartnerCardFragmentContainer as PartnerCard } from "./Components/PartnerCard"
import { PartnerLink } from "./Components/PartnerLink"
import { ShippingAndTaxesFragmentContainer } from "./Components/ShippingAndTaxes"

interface ArtworkProps {
  artworkAboveTheFold: Artwork_artworkAboveTheFold$data | null
  artworkBelowTheFold: Artwork_artworkBelowTheFold$data | null
  me: Artwork_me$data | null
  isVisible: boolean
  relay: RelayRefetchProp
  tracking?: TrackingProp
}

export const Artwork: React.FC<ArtworkProps> = ({
  artworkAboveTheFold,
  artworkBelowTheFold,
  isVisible,
  me,
  relay,
  tracking,
}) => {
  const [refreshing, setRefreshing] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const enableConversationalBuyNow = useFeatureFlag("AREnableConversationalBuyNow")
  const enableArtworkRedesign = useFeatureFlag("ARArtworkRedesingPhase2")

  const { internalID, slug, isInAuction, partner: partnerAbove } = artworkAboveTheFold || {}
  const { isPreview, isClosed, liveStartAt } = artworkAboveTheFold?.sale ?? {}
  const { partner, sale, contextGrids, artistSeriesConnection, artist, context } =
    artworkBelowTheFold || {}

  const getInitialAuctionTimerState = () => {
    if (isInAuction) {
      return currentTimerState({
        isPreview: isPreview || undefined,
        isClosed: isClosed || undefined,
        liveStartsAt: liveStartAt || undefined,
      })
    }
  }

  const [auctionTimerState, setAuctionTimerState] = useState<string | undefined>(
    getInitialAuctionTimerState()
  )
  const isInClosedAuction = isInAuction && auctionTimerState === AuctionTimerState.CLOSED

  const shouldRenderPartner = () => {
    if ((sale && sale.isBenefit) || (sale && sale.isGalleryAuction)) {
      return false
    } else if (partner && partner.type && partner.type !== "Auction House") {
      return true
    } else {
      return false
    }
  }

  const shouldRenderOtherWorks = () => {
    const gridsToShow = populatedGrids(contextGrids)

    if (gridsToShow && gridsToShow.length > 0) {
      return true
    } else {
      return false
    }
  }

  const shouldRenderArtworksInArtistSeries = () => {
    const artistSeries = artistSeriesConnection?.edges?.[0]
    const numArtistSeriesArtworks = artistSeries?.node?.filterArtworksConnection?.edges?.length ?? 0
    return numArtistSeriesArtworks > 0
  }

  const shouldRenderArtistSeriesMoreSeries = () => {
    return (artist?.artistSeriesConnection?.totalCount ?? 0) > 0
  }

  const shouldRenderLotDetails = () => {
    return enableArtworkRedesign && isInAuction && sale && artworkAboveTheFold?.saleArtwork
  }

  const shouldRenderConsignmentsSection = () => {
    const { isAcquireable, isOfferable } = artworkAboveTheFold ?? {}
    const { isForSale } = artworkBelowTheFold ?? {}
    const artists = artworkBelowTheFold?.artists ?? []
    const consignableArtists = artists.filter((currentArtist) => !!currentArtist?.isConsignable)
    const isBiddableInAuction =
      isInAuction && sale && auctionTimerState !== AuctionTimerState.CLOSED && isForSale

    return (
      enableArtworkRedesign &&
      (consignableArtists.length || isAcquireable || isOfferable || isBiddableInAuction)
    )
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

    relay.refetch(
      { artistID: internalID },
      null,
      () => {
        setRefreshing(false)
        cb?.()
      },
      {
        force: true,
      }
    )
  }

  const refetch = (cb?: () => any) => {
    relay.refetch(
      { artistID: internalID },
      null,
      () => {
        cb?.()
      },
      { force: true }
    )
  }

  const handleModalDismissed = () => {
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

    if (artworkAboveTheFold && me) {
      sections.push({
        key: "header",
        element: <ArtworkHeader artwork={artworkAboveTheFold} />,
        excludePadding: true,
      })

      sections.push({
        key: "commercialInformation",
        element: (
          <CommercialInformation
            artwork={artworkAboveTheFold}
            me={me}
            tracking={tracking}
            refetchArtwork={() =>
              relay.refetch({ artworkID: internalID }, null, () => null, { force: true })
            }
            setAuctionTimerState={setAuctionTimerState}
          />
        ),
      })
    }

    if (shouldRenderLotDetails()) {
      sections.push({
        key: "lotDetailsSection",
        element: (
          <ArtworkLotDetails
            artwork={artworkAboveTheFold!}
            auctionState={auctionTimerState as AuctionTimerState}
          />
        ),
      })
    }

    if (!enableConversationalBuyNow && !!partnerAbove?.name && artworkAboveTheFold) {
      sections.push({
        key: "partnerSection",
        element: <PartnerLink artwork={artworkAboveTheFold} />,
        verticalMargin: 2,
      })
    }

    if (
      !isEmpty(artworkAboveTheFold?.artists) &&
      !artworkAboveTheFold?.isSold &&
      !isInClosedAuction
    ) {
      sections.push({
        key: "createAlertSection",
        element: <CreateArtworkAlertSection artwork={artworkAboveTheFold} />,
        verticalMargin: 2,
      })
    }

    if (!!(artworkAboveTheFold?.isAcquireable || artworkAboveTheFold?.isOfferable)) {
      sections.push({
        key: "faqSection",
        element: <FaqAndSpecialistSection artwork={artworkAboveTheFold} />,
        verticalMargin: 2,
      })
    }

    if (!artworkBelowTheFold) {
      sections.push({
        key: "belowTheFoldPlaceholder",
        element: <BelowTheFoldPlaceholder />,
      })
      return sections
    }

    if (artworkBelowTheFold.description || artworkBelowTheFold.additionalInformation) {
      sections.push({
        key: "aboutWork",
        element: <AboutWork artwork={artworkBelowTheFold} />,
      })
    }

    sections.push({
      key: "artworkDetails",
      element: <ArtworkDetails artwork={artworkBelowTheFold} />,
    })

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

    if (artist && artist.biographyBlurb) {
      sections.push({
        key: "aboutArtist",
        element: <AboutArtist artwork={artworkBelowTheFold} />,
      })
    }

    if (shouldRenderConsignmentsSection()) {
      sections.push({
        key: "consignments",
        element: <ArtworkConsignments artwork={artworkBelowTheFold} />,
      })
    }

    if (shouldRenderPartner()) {
      sections.push({
        key: "partnerCard",
        element: (
          <PartnerCard
            shouldShowQuestions={
              !!(
                enableConversationalBuyNow &&
                artworkBelowTheFold &&
                (artworkAboveTheFold?.isAcquireable ||
                  (!artworkAboveTheFold?.isInquireable && artworkAboveTheFold?.isOfferable))
              )
            }
            artwork={artworkBelowTheFold}
          />
        ),
      })
    }

    if (!!(artworkBelowTheFold.isForSale && !isInAuction)) {
      sections.push({
        key: "shippingAndTaxes",
        element: <ShippingAndTaxesFragmentContainer artwork={artworkBelowTheFold!} />,
      })
    }

    if (!!artworkAboveTheFold?.isEligibleForArtsyGuarantee) {
      sections.push({
        key: "artsyGuarantee",
        element: <ArtsyGuarantee />,
      })
    }

    if (context && context.__typename === "Sale" && context.isAuction) {
      sections.push({
        key: "contextCard",
        element: <ContextCard artwork={artworkBelowTheFold} />,
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

  const websocketEnabled = !!artworkBelowTheFold?.sale?.extendedBiddingIntervalMinutes

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtworkPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
        context_screen_owner_slug: slug,
        context_screen_owner_id: internalID,
        // @ts-ignore
        availability: artworkAboveTheFold?.availability,
        acquireable: artworkAboveTheFold?.isAcquireable,
        inquireable: artworkAboveTheFold?.isInquireable,
        offerable: artworkAboveTheFold?.isOfferable,
        biddable: artworkAboveTheFold?.isBiddable,
      }}
    >
      <AuctionWebsocketContextProvider
        channelInfo={{
          channel: "SalesChannel",
          sale_id: artworkBelowTheFold?.sale?.internalID,
        }}
        enabled={websocketEnabled}
      >
        {fetchingData ? (
          <ProvidePlaceholderContext>
            <AboveTheFoldPlaceholder />
          </ProvidePlaceholderContext>
        ) : (
          <FlatList<ArtworkPageSection>
            keyboardShouldPersistTaps="handled"
            data={sectionsData()}
            ItemSeparatorComponent={() => (
              <Box mx={2}>
                <Separator />
              </Box>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <Box my={item.verticalMargin ?? 3} px={item.excludePadding ? 0 : 2}>
                {item.element}
              </Box>
            )}
          />
        )}
        <QAInfo />
        <OfferSubmittedModal />
      </AuctionWebsocketContextProvider>
    </ProvideScreenTracking>
  )
}

interface ArtworkPageSection {
  key: string
  element: JSX.Element
  excludePadding?: boolean
  // use verticalMargin to pass custom spacing between separator and section
  verticalMargin?: ResponsiveValue<number>
}

export const ArtworkContainer = createRefetchContainer(
  Artwork,
  {
    artworkAboveTheFold: graphql`
      fragment Artwork_artworkAboveTheFold on Artwork {
        ...ArtworkHeader_artwork
        ...CommercialInformation_artwork
        ...FaqAndSpecialistSection_artwork
        ...CreateArtworkAlertSection_artwork
        ...PartnerLink_artwork
        ...ArtworkLotDetails_artwork
        slug
        internalID
        id
        isAcquireable
        isOfferable
        isBiddable
        isInquireable
        isSold
        isEligibleForArtsyGuarantee
        isInAuction
        availability
        artists {
          name
        }
        sale {
          isClosed
          isPreview
          liveStartAt
        }
        saleArtwork {
          internalID
        }
        partner {
          name
          href
          isLinkable
        }
      }
    `,
    artworkBelowTheFold: graphql`
      fragment Artwork_artworkBelowTheFold on Artwork {
        additionalInformation
        description
        provenance
        exhibitionHistory
        literature
        isForSale
        partner {
          type
          id
        }
        artist {
          biographyBlurb {
            text
          }
          artistSeriesConnection(first: 4) {
            totalCount
          }
          ...ArtistSeriesMoreSeries_artist
        }
        sale {
          internalID
          id
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
        artists {
          isConsignable
        }
        ...PartnerCard_artwork
        ...AboutWork_artwork
        ...OtherWorks_artwork
        ...AboutArtist_artwork
        ...ArtworkDetails_artwork
        ...ContextCard_artwork
        ...ArtworkHistory_artwork
        ...ArtworksInSeriesRail_artwork
        ...ShippingAndTaxes_artwork
        ...ArtworkConsignments_artwork
      }
    `,
    me: graphql`
      fragment Artwork_me on Me {
        ...CommercialInformation_me
      }
    `,
  },
  graphql`
    query ArtworkRefetchQuery($artworkID: String!) {
      artwork(id: $artworkID) {
        ...Artwork_artworkAboveTheFold
        ...Artwork_artworkBelowTheFold
      }
    }
  `
)

export const ArtworkScreenQuery = graphql`
  query ArtworkAboveTheFoldQuery($artworkID: String!) {
    artwork(id: $artworkID) {
      ...Artwork_artworkAboveTheFold
    }
    me {
      ...Artwork_me
    }
  }
`

export const ArtworkQueryRenderer: React.FC<{
  artworkID: string
  isVisible: boolean
  environment?: RelayModernEnvironment
  tracking?: TrackingProp
}> = ({ artworkID, environment, ...others }) => {
  return (
    <>
      <RetryErrorBoundaryLegacy
        render={() => {
          return (
            <AboveTheFoldQueryRenderer<ArtworkAboveTheFoldQuery, ArtworkBelowTheFoldQuery>
              environment={environment || defaultEnvironment}
              above={{
                query: ArtworkScreenQuery,
                variables: { artworkID },
              }}
              below={{
                query: graphql`
                  query ArtworkBelowTheFoldQuery($artworkID: String!) {
                    artwork(id: $artworkID) {
                      ...Artwork_artworkBelowTheFold
                    }
                  }
                `,
                variables: { artworkID },
              }}
              render={{
                renderPlaceholder: () => <AboveTheFoldPlaceholder artworkID={artworkID} />,
                renderComponent: ({ above, below }) => {
                  return (
                    <ArtworkContainer
                      artworkAboveTheFold={above.artwork}
                      artworkBelowTheFold={below?.artwork ?? null}
                      me={above.me}
                      {...others}
                    />
                  )
                },
              }}
              fetchPolicy="store-and-network"
              cacheConfig={{ force: true }}
            />
          )
        }}
      />
    </>
  )
}
