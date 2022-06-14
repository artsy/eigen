import { CommercialInformation_artwork$data } from "__generated__/CommercialInformation_artwork.graphql"
import { CommercialInformation_me$data } from "__generated__/CommercialInformation_me.graphql"
import {
  AuctionTimerState,
  Countdown,
  currentTimerState,
  nextTimerState,
  relevantStateData,
} from "app/Components/Bidding/Components/Timer"
import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import { StateManager as CountdownStateManager } from "app/Components/Countdown"
import { CountdownTimerProps } from "app/Components/Countdown/CountdownTimer"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { AuctionWebsocketContextProvider } from "app/Websockets/auctions/AuctionSocketContext"
import { useArtworkBidding } from "app/Websockets/auctions/useArtworkBidding"
import { capitalize } from "lodash"
import { Box, ClassTheme, Flex, Spacer, Text } from "palette"
import React, { useEffect, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { TrackingProp, useTracking } from "react-tracking"
import styled from "styled-components/native"
import { ArtworkExtraLinksFragmentContainer as ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { AuctionPriceFragmentContainer as AuctionPrice } from "./AuctionPrice"
import { CommercialButtonsFragmentContainer as CommercialButtons } from "./CommercialButtons/CommercialButtons"
import { CommercialEditionSetInformationFragmentContainer as CommercialEditionSetInformation } from "./CommercialEditionSetInformation"
import { CommercialPartnerInformationFragmentContainer as CommercialPartnerInformation } from "./CommercialPartnerInformation"
import { CreateArtworkAlertButtonsSectionFragmentContainer as CreateArtworkAlertButtonsSection } from "./CreateArtworkAlertButtonsSection"

interface CommercialInformationProps extends CountdownTimerProps {
  artwork: CommercialInformation_artwork$data
  me: CommercialInformation_me$data
  hasStarted?: boolean
  tracking?: TrackingProp
  biddingEndAt?: string
  hasBeenExtended?: boolean
  refetchArtwork: () => void
  setAuctionTimerState?: (auctionTimerState: string) => void
}

// On Android, the useArtworkBidding fails to receive data, bringing the
// ContextProvider down closer to this component fixed it. [Android Only]
const CommercialInformationWebsocketWrapper: React.FC<CommercialInformationProps> = (props) => {
  const cascadingEndTimeFeatureEnabled = useFeatureFlag("AREnableCascadingEndTimerLotPage")
  const websocketEnabled =
    cascadingEndTimeFeatureEnabled && !!props.artwork.sale?.cascadingEndTimeIntervalMinutes
  return (
    <AuctionWebsocketContextProvider
      channelInfo={{
        channel: "SalesChannel",
        sale_id: props.artwork.sale?.internalID,
      }}
      enabled={websocketEnabled}
    >
      <CommercialInformationTimerWrapper {...props} />
    </AuctionWebsocketContextProvider>
  )
}

export const CommercialInformationTimerWrapper: React.FC<CommercialInformationProps> = (props) => {
  if (props.artwork.isInAuction && props.artwork.saleArtwork) {
    const {
      isPreview,
      isClosed,
      cascadingEndTimeIntervalMinutes,
      liveStartAt: liveStartsAt,
      startAt: startsAt,
      endAt: saleEndAt,
    } = props.artwork.sale || {}

    const { endAt: lotEndAt, extendedBiddingEndAt, lotID } = props.artwork.saleArtwork

    const initialBiddingEndAt = extendedBiddingEndAt ?? lotEndAt ?? saleEndAt

    const { currentBiddingEndAt, lotSaleExtended } = useArtworkBidding({
      lotID,
      lotEndAt,
      biddingEndAt: initialBiddingEndAt,
      onDataReceived: props.refetchArtwork,
    })

    return (
      <TimeOffsetProvider>
        <CountdownStateManager
          CountdownComponent={CommercialInformation as any}
          onCurrentTickerState={() => {
            const state = currentTimerState({
              isPreview: isPreview || undefined,
              isClosed: isClosed || undefined,
              liveStartsAt: liveStartsAt || undefined,
              lotEndAt,
              biddingEndAt: currentBiddingEndAt,
            })
            const { label, date, hasStarted } = relevantStateData(state, {
              liveStartsAt: liveStartsAt || undefined,
              startsAt: startsAt || undefined,
              lotEndAt,
              biddingEndAt: currentBiddingEndAt,
            })

            return {
              label,
              date,
              state,
              hasStarted,
              cascadingEndTimeIntervalMinutes,
              hasBeenExtended: lotSaleExtended,
              biddingEndAt: currentBiddingEndAt,
            }
          }}
          onNextTickerState={({ state }) => {
            const nextState = nextTimerState(state as AuctionTimerState, {
              liveStartsAt: liveStartsAt || undefined,
            })
            const { label, date, hasStarted } = relevantStateData(nextState, {
              liveStartsAt: liveStartsAt || undefined,
              startsAt: startsAt || undefined,
              lotEndAt,
              biddingEndAt: currentBiddingEndAt,
            })

            return {
              state: nextState,
              date,
              label,
              hasStarted,
              hasBeenExtended: lotSaleExtended,
              biddingEndAt: currentBiddingEndAt,
            }
          }}
          {...(props as any)}
        />
      </TimeOffsetProvider>
    )
  } else {
    return <CommercialInformation {...props} />
  }
}

const ColoredDot = styled(Box)<{ dotColor: string }>`
  background-color: ${({ dotColor }: any) => dotColor};
  width: 8px;
  height: 8px;
  border-radius: 8px;
  margin-right: 8px;
`

export const SaleAvailability: React.FC<{ dotColor?: string; saleMessage: string }> = ({
  dotColor,
  saleMessage,
}) => {
  return (
    <Flex flexWrap="nowrap" flexDirection="row" alignItems="center">
      {!!dotColor && <ColoredDot dotColor={dotColor} />}
      <Text variant="lg">{saleMessage}</Text>
    </Flex>
  )
}

export const CommercialInformation: React.FC<CommercialInformationProps> = ({
  artwork,
  timerState,
  me,
  duration,
  label,
  hasStarted,
  biddingEndAt,
  hasBeenExtended,
  setAuctionTimerState,
}) => {
  const { trackEvent } = useTracking()
  const enableCreateArtworkAlert = useFeatureFlag("AREnableCreateArtworkAlert")
  const [editionSetID, setEditionSetID] = useState<string | null>(null)
  const { isAcquireable, isOfferable, isInquireable, isInAuction, sale, isForSale, isSold } =
    artwork

  const isInClosedAuction = isInAuction && sale && timerState === AuctionTimerState.CLOSED
  const artistIsConsignable = artwork?.artists?.filter((artist) => artist?.isConsignable).length
  const hidesPriceInformation =
    isInAuction && isForSale && timerState === AuctionTimerState.LIVE_INTEGRATION_ONGOING
  const isBiddableInAuction =
    isInAuction && sale && timerState !== AuctionTimerState.CLOSED && isForSale
  const canTakeCommercialAction =
    isAcquireable || isOfferable || isInquireable || isBiddableInAuction
  const shouldShowCreateArtworkAlertButton =
    enableCreateArtworkAlert && (isSold || isInClosedAuction)

  useEffect(() => {
    const artworkIsInActiveAuction = artwork.isInAuction && timerState !== AuctionTimerState.CLOSED

    if (artworkIsInActiveAuction) {
      trackEvent({
        action_type: Schema.ActionNames.LotViewed,
        artwork_id: artwork.internalID,
        artwork_slug: artwork.slug,
        sale_id: artwork.sale?.internalID,
        auction_slug: artwork.sale?.slug,
      })
    }
  }, [])

  useEffect(() => {
    if (timerState) {
      setAuctionTimerState?.(timerState)
    }
  }, [timerState])

  const renderSingleEditionArtwork = () => {
    const artworkIsInClosedAuction = artwork.isInAuction && timerState === AuctionTimerState.CLOSED
    const saleMessage = artwork.saleMessage
      ? artwork.saleMessage === "Contact For Price"
        ? "Price on request"
        : artwork.saleMessage
      : capitalize(artwork.availability || undefined)

    return (
      <ClassTheme>
        {({ color }) => {
          let indicatorColor
          let newSaleMessage

          if (
            artwork.availability?.toLowerCase() === "on loan" ||
            artwork.availability?.toLowerCase() === "on hold"
          ) {
            indicatorColor = color("yellow100")
          } else if (
            artwork.availability?.toLowerCase() === "sold" ||
            artwork.availability?.toLowerCase() === "not for sale"
          ) {
            indicatorColor = color("red100")
          } else if (artworkIsInClosedAuction) {
            newSaleMessage = "Bidding closed"
          } else if (
            artwork.saleMessage?.toLowerCase() === "contact for price" &&
            artwork.isForSale
          ) {
            newSaleMessage = "For sale"
            indicatorColor = color("green100")
          }

          return (
            <>
              <SaleAvailability
                dotColor={indicatorColor}
                saleMessage={newSaleMessage ? newSaleMessage : saleMessage}
              />
              {!artworkIsInClosedAuction && <CommercialPartnerInformation artwork={artwork} />}
            </>
          )
        }}
      </ClassTheme>
    )
  }

  const renderPriceInformation = () => {
    if (isInAuction && isForSale) {
      if (timerState === AuctionTimerState.LIVE_INTEGRATION_ONGOING) {
        return null
      } else {
        return <AuctionPrice artwork={artwork} auctionState={timerState as AuctionTimerState} />
      }
    } else if (artwork.editionSets && artwork.editionSets.length > 1) {
      return renderEditionSetArtwork()
    } else {
      return renderSingleEditionArtwork()
    }
  }

  const renderEditionSetArtwork = () => {
    return (
      <CommercialEditionSetInformation
        artwork={artwork}
        setEditionSetId={(newEditionSetID) => {
          setEditionSetID(newEditionSetID)
        }}
      />
    )
  }

  const renderCommercialButtons = () => {
    if (!!(canTakeCommercialAction && !isInClosedAuction)) {
      return (
        <>
          {!hidesPriceInformation && <Spacer mb={2} />}
          <CommercialButtons
            artwork={artwork}
            me={me}
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            auctionState={timerState}
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            editionSetID={editionSetID}
          />
        </>
      )
    }

    return null
  }

  const renderCountdown = () => {
    if (!!isBiddableInAuction) {
      return (
        <>
          <Spacer mb={2} />
          <Countdown
            label={label}
            hasStarted={hasStarted}
            cascadingEndTimeIntervalMinutes={sale.cascadingEndTimeIntervalMinutes}
            duration={duration}
            extendedBiddingIntervalMinutes={sale.extendedBiddingIntervalMinutes}
            extendedBiddingPeriodMinutes={sale.extendedBiddingPeriodMinutes}
            biddingEndAt={biddingEndAt}
            startAt={sale.startAt}
            hasBeenExtended={hasBeenExtended}
          />
        </>
      )
    }

    return null
  }

  return (
    <>
      {shouldShowCreateArtworkAlertButton ? (
        <CreateArtworkAlertButtonsSection artwork={artwork} auctionState={timerState} />
      ) : (
        <Box>
          {renderPriceInformation()}
          {renderCommercialButtons()}
          {renderCountdown()}
        </Box>
      )}
      {!!(!!artistIsConsignable || isAcquireable || isOfferable || isBiddableInAuction) && (
        <>
          <Spacer mb={2} />
          <ArtworkExtraLinks
            artwork={artwork}
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            auctionState={timerState}
          />
        </>
      )}
    </>
  )
}

export const CommercialInformationFragmentContainer = createFragmentContainer(
  CommercialInformationWebsocketWrapper,
  {
    artwork: graphql`
      fragment CommercialInformation_artwork on Artwork {
        isAcquireable
        isOfferable
        isInquireable
        isInAuction
        isSold
        availability
        saleMessage
        isForSale
        internalID
        slug

        artists {
          isConsignable
        }

        editionSets {
          id
        }

        saleArtwork {
          lotID
          endAt
          extendedBiddingEndAt
        }

        sale {
          cascadingEndTimeIntervalMinutes
          extendedBiddingIntervalMinutes
          extendedBiddingPeriodMinutes
          internalID
          isClosed
          isAuction
          isLiveOpen
          isPreview
          liveStartAt
          endAt
          slug
          startAt
        }

        ...CommercialButtons_artwork
        ...CommercialPartnerInformation_artwork
        ...CommercialEditionSetInformation_artwork
        ...ArtworkExtraLinks_artwork
        ...AuctionPrice_artwork
        ...CreateArtworkAlertButtonsSection_artwork
      }
    `,
    me: graphql`
      fragment CommercialInformation_me on Me {
        ...CommercialButtons_me
      }
    `,
  }
)
