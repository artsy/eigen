import { Spacer, TimerIcon, Flex, Text, Color } from "@artsy/palette-mobile"
import { ArtworkLotTimer_artwork$data } from "__generated__/ArtworkLotTimer_artwork.graphql"
import { ArtworkAuctionProgressBar } from "app/Components/Bidding/Components/ArtworkAuctionProgressBar"
import {
  AuctionTimerState,
  currentTimerState,
  nextTimerState,
  relevantStateData,
} from "app/Components/Bidding/Components/Timer"
import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import { StateManager as CountdownStateManager } from "app/Components/Countdown"
import { CountdownTimerProps } from "app/Components/Countdown/CountdownTimer"
import { ModernTicker, SimpleTicker } from "app/Components/Countdown/Ticker"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { AuctionWebsocketContextProvider } from "app/utils/Websockets/auctions/AuctionSocketContext"
import { useArtworkBidding } from "app/utils/Websockets/auctions/useArtworkBidding"
import { Time } from "app/utils/getTimer"
import { getTimerInfo } from "app/utils/saleTime"
import moment from "moment"
import { useEffect } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { TrackingProp } from "react-tracking"

interface AuctionWebsocketWrapperProps extends CountdownTimerProps {
  artwork: ArtworkLotTimer_artwork$data
  hasStarted?: boolean
  tracking?: TrackingProp
  biddingEndAt?: string
  hasBeenExtended?: boolean
  refetchArtwork: () => void
}

const AuctionoWebsocketWrapper: React.FC<AuctionWebsocketWrapperProps> = (props) => {
  const websocketEnabled = !!props.artwork.sale?.cascadingEndTimeIntervalMinutes
  return (
    <AuctionWebsocketContextProvider
      channelInfo={{
        channel: "SalesChannel",
        sale_id: props.artwork.sale?.internalID,
      }}
      enabled={websocketEnabled}
    >
      <ArtworkLotTimerWrapper {...props} />
    </AuctionWebsocketContextProvider>
  )
}

export const ArtworkLotTimerWrapper: React.FC<AuctionWebsocketWrapperProps> = (props) => {
  const { artwork, refetchArtwork } = props

  const {
    isPreview,
    isClosed,
    cascadingEndTimeIntervalMinutes,
    liveStartAt: liveStartsAt,
    startAt: startsAt,
    endAt: saleEndAt,
  } = props.artwork.sale ?? {}

  const { endAt: lotEndAt, extendedBiddingEndAt, lotID } = artwork.saleArtwork ?? {}

  const initialBiddingEndAt = extendedBiddingEndAt ?? lotEndAt ?? saleEndAt

  const { currentBiddingEndAt, lotSaleExtended } = useArtworkBidding({
    lotID,
    lotEndAt,
    biddingEndAt: initialBiddingEndAt,
    onDataReceived: refetchArtwork,
  })

  if (!(artwork.isInAuction && artwork.saleArtwork && artwork.sale)) {
    return null
  }

  return (
    <TimeOffsetProvider>
      <CountdownStateManager
        CountdownComponent={RenderCountdown as any}
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
}

const RenderCountdown: React.FC<AuctionWebsocketWrapperProps> = ({
  label,
  artwork,
  timerState,
  duration,
  hasStarted,
  biddingEndAt,
  hasBeenExtended,
}) => {
  const { sale, isForSale, collectorSignals } = artwork
  const isBiddableInAuction = timerState !== AuctionTimerState.CLOSED && isForSale
  const setAuctionState = ArtworkStore.useStoreActions((action) => action.setAuctionState)

  useEffect(() => {
    if (timerState) {
      setAuctionState(timerState)
    }
  }, [timerState])

  const getColor = () => {
    if (!duration) {
      return
    }

    const time: Time = {
      days: duration.asDays().toString(),
      hours: duration.hours().toString(),
      minutes: duration.minutes().toString(),
      seconds: duration.seconds().toString(),
    }

    const timerInfo = getTimerInfo(time, { hasStarted, isExtended: hasBeenExtended })

    return timerInfo.color as Color
  }

  // display the timer and progress bar only when duration is positive and lot is biddable
  const shouldShowTimer = !!isBiddableInAuction && moment.duration(duration).milliseconds() > 0

  const isBiddingClosed = !!artwork.saleArtwork?.endedAt || timerState === AuctionTimerState.CLOSED

  return (
    <>
      <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
        {!!artwork.saleArtwork?.lotLabel && (
          <Text variant="md" color="mono100">
            Lot {artwork.saleArtwork.lotLabel}
          </Text>
        )}

        {!!isBiddingClosed && (
          <Text variant="sm-display" textAlign="right">
            Bidding closed
          </Text>
        )}

        {!!shouldShowTimer && (
          <>
            <Spacer x={4} />
            <Flex flexDirection="row" alignItems="center" accessibilityLabel="CountdownTimer">
              {sale?.cascadingEndTimeIntervalMinutes ? (
                <ModernTicker
                  duration={duration}
                  hasStarted={hasStarted}
                  isExtended={hasBeenExtended}
                  variant="md"
                />
              ) : (
                <SimpleTicker duration={duration} separator="  " variant="md" />
              )}
              <TimerIcon height={24} width={24} fill={getColor()} ml={1} />
            </Flex>
          </>
        )}
      </Flex>
      {!!shouldShowTimer && (
        <>
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text variant="xs" color="mono60">
              {!!collectorSignals?.auction?.lotWatcherCount
                ? `${collectorSignals.auction.lotWatcherCount} Watcher${
                    collectorSignals.auction.lotWatcherCount > 1 ? "s" : ""
                  }`
                : ""}
            </Text>

            <Text variant="xs" color="mono60" textAlign="right">
              {label}
            </Text>
          </Flex>

          <Spacer y={1} />
          {!!sale?.extendedBiddingPeriodMinutes && !!sale?.extendedBiddingIntervalMinutes && (
            <>
              <ArtworkAuctionProgressBar
                startAt={sale.startAt}
                extendedBiddingPeriodMinutes={sale.extendedBiddingPeriodMinutes}
                extendedBiddingIntervalMinutes={sale.extendedBiddingIntervalMinutes}
                biddingEndAt={biddingEndAt}
                hasBeenExtended={!!hasBeenExtended}
                height={5}
              />
              <Spacer y={2} />
            </>
          )}
        </>
      )}
    </>
  )
}

export const ArtworkLotTimerFragmentContainer = createFragmentContainer(AuctionoWebsocketWrapper, {
  artwork: graphql`
    fragment ArtworkLotTimer_artwork on Artwork {
      isInAuction
      isForSale
      saleArtwork {
        lotLabel(trim: true)
        lotID
        endAt
        extendedBiddingEndAt
        endedAt
      }
      sale {
        internalID
        extendedBiddingPeriodMinutes
        extendedBiddingIntervalMinutes
        cascadingEndTimeIntervalMinutes
        isPreview
        isClosed
        cascadingEndTimeIntervalMinutes
        liveStartAt
        startAt
        endAt
      }
      collectorSignals {
        auction {
          lotWatcherCount
        }
      }
    }
  `,
})
