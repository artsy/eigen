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
import { getTimerInfo } from "app/utils/saleTime"
import { Time } from "app/utils/useTimer"
import { AuctionWebsocketContextProvider } from "app/Websockets/auctions/AuctionSocketContext"
import { useArtworkBidding } from "app/Websockets/auctions/useArtworkBidding"
import moment from "moment"
import { Flex, Spacer, Text, TimerIcon } from "palette"
import { Color } from "palette/Theme"
import { createFragmentContainer, graphql } from "react-relay"
import { TrackingProp } from "react-tracking"

interface AuctionWebsocketWrapperProps extends CountdownTimerProps {
  artwork: ArtworkLotTimer_artwork$data
  hasStarted?: boolean
  tracking?: TrackingProp
  biddingEndAt?: string
  hasBeenExtended?: boolean
  refetchArtwork: () => void
  setAuctionTimerState?: (auctionTimerState: string) => void
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
  } else {
    return null
  }
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
  const { isInAuction, sale, isForSale } = artwork
  const isBiddableInAuction =
    isInAuction && sale && timerState !== AuctionTimerState.CLOSED && isForSale

  const displayAuctionLotLabel =
    artwork.isInAuction &&
    artwork.saleArtwork &&
    artwork.saleArtwork.lotLabel &&
    artwork.sale &&
    !artwork.sale.isClosed

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

  return (
    <>
      <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between">
        {!!displayAuctionLotLabel && (
          <Text variant="md" color="black100">
            Lot {artwork.saleArtwork.lotLabel}
          </Text>
        )}
        {!!shouldShowTimer && (
          <>
            <Spacer mr={4} />
            <Flex flexDirection="row" alignItems="center">
              {sale.cascadingEndTimeIntervalMinutes ? (
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
          <Flex alignItems="flex-end">
            <Text variant="xs" color="black60">
              {label}
            </Text>
          </Flex>
          <Spacer mt={1} />
          {!!sale.extendedBiddingPeriodMinutes && !!sale.extendedBiddingIntervalMinutes && (
            <>
              <ArtworkAuctionProgressBar
                startAt={sale.startAt}
                extendedBiddingPeriodMinutes={sale.extendedBiddingPeriodMinutes}
                extendedBiddingIntervalMinutes={sale.extendedBiddingIntervalMinutes}
                biddingEndAt={biddingEndAt}
                hasBeenExtended={!!hasBeenExtended}
                height={5}
              />
              <Spacer mt={2} />
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
        lotLabel
        lotID
        endAt
        extendedBiddingEndAt
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
    }
  `,
})
