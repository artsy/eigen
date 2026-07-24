import { Button } from "@artsy/palette-mobile"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { LiveAuctionBidButtonState } from "app/Scenes/LiveSale/types/liveAuction"

const OUTBID_FLASH_DURATION_MS = 1000

export interface LiveAuctionBidButtonProps {
  buttonState: LiveAuctionBidButtonState
  onPress: (action: "bid" | "registerToBid" | "submitMaxBid") => void
  flashOutbidOnBiddableStateChanges?: boolean
  hideOnError?: boolean
}

type ButtonConfig = {
  label: string
  variant?: "fillDark" | "fillGray" | "fillSuccess" | "outline" | "outlineGray"
  disabled: boolean
  loading?: boolean
}

const formatPrice = (cents: number, symbol: string): string => {
  return `${symbol}${(cents / 100).toLocaleString()}`
}

const getStateKey = (state: LiveAuctionBidButtonState): string => {
  if (state.kind === "inactive") {
    return `inactive-${state.lotPhase}-${state.isHighestBidder ?? false}`
  }
  return `active-${state.biddingState.kind}`
}

const getButtonConfig = (state: LiveAuctionBidButtonState): ButtonConfig => {
  if (state.kind === "inactive") {
    switch (state.lotPhase) {
      case "upcoming":
        return {
          label: state.isHighestBidder ? "Increase Max Bid" : "Bid",
          disabled: false,
        }
      case "closedSold":
        return { label: "Sold", variant: "outlineGray", disabled: true }
      case "closedPassed":
        return { label: "Lot Closed", variant: "outlineGray", disabled: true }
    }
  }

  switch (state.biddingState.kind) {
    case "userRegistrationRequired":
      return { label: "Register to Bid", disabled: false }
    case "userRegistrationPending":
      return { label: "Registration Pending", variant: "fillGray", disabled: true }
    case "userRegistrationClosed":
      return { label: "Registration Closed", variant: "fillGray", disabled: true }
    case "lotWaitingToOpen":
      return { label: "Waiting for Auctioneer…", variant: "outlineGray", disabled: true }
    case "biddable":
      return {
        label: `Bid ${formatPrice(
          state.biddingState.askingPriceCents,
          state.biddingState.currencySymbol
        )}`,
        disabled: false,
      }
    case "biddingInProgress":
      return { label: "", loading: true, disabled: true }
    case "bidNotYetAccepted":
      return {
        label: `Bid ${formatPrice(
          state.biddingState.askingPriceCents,
          state.biddingState.currencySymbol
        )}`,
        variant: "fillGray",
        disabled: true,
      }
    case "bidBecameMaxBidder":
    case "bidAcknowledged":
      return { label: "You're the Highest Bidder", variant: "fillSuccess", disabled: true }
    case "bidOutbid":
      return { label: "Outbid", variant: "outline", disabled: true }
    case "bidNetworkFail":
      return { label: "Network Failed", variant: "outline", disabled: true }
    case "bidFailed":
      return { label: "An Error Occurred", variant: "outline", disabled: true }
    case "lotSold":
      return { label: "Sold", variant: "outlineGray", disabled: true }
  }
}

const getOnPressAction = (
  state: LiveAuctionBidButtonState
): "bid" | "registerToBid" | "submitMaxBid" | null => {
  if (state.kind === "inactive") {
    return state.lotPhase === "upcoming" ? "submitMaxBid" : null
  }
  if (state.biddingState.kind === "userRegistrationRequired") return "registerToBid"
  if (state.biddingState.kind === "biddable") return "bid"
  return null
}

export const LiveAuctionBidButton: React.FC<LiveAuctionBidButtonProps> = ({
  buttonState,
  onPress,
  flashOutbidOnBiddableStateChanges = true,
  hideOnError = false,
}) => {
  const [displayedState, setDisplayedState] = useState<LiveAuctionBidButtonState>(buttonState)
  const previousStateRef = useRef<LiveAuctionBidButtonState>(buttonState)
  const isFlashingRef = useRef(false)
  const queuedStateRef = useRef<LiveAuctionBidButtonState | null>(null)
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stateKey = getStateKey(buttonState)

  useLayoutEffect(() => {
    if (isFlashingRef.current) {
      queuedStateRef.current = buttonState
      return
    }

    const prev = previousStateRef.current
    const isBecomingBiddable =
      buttonState.kind === "active" && buttonState.biddingState.kind === "biddable"
    const wasMaxBidder =
      prev.kind === "active" &&
      (prev.biddingState.kind === "bidBecameMaxBidder" ||
        prev.biddingState.kind === "bidNotYetAccepted")

    if (flashOutbidOnBiddableStateChanges && isBecomingBiddable && wasMaxBidder) {
      isFlashingRef.current = true
      setDisplayedState({ kind: "active", biddingState: { kind: "bidOutbid" } })

      flashTimerRef.current = setTimeout(() => {
        isFlashingRef.current = false
        const next = queuedStateRef.current ?? buttonState
        queuedStateRef.current = null
        setDisplayedState(next)
        previousStateRef.current = next
      }, OUTBID_FLASH_DURATION_MS)

      previousStateRef.current = buttonState
      return
    }

    previousStateRef.current = displayedState
    setDisplayedState(buttonState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey, flashOutbidOnBiddableStateChanges])

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    }
  }, [])

  const isFailed =
    displayedState.kind === "active" && displayedState.biddingState.kind === "bidFailed"
  if (isFailed && hideOnError) {
    return null
  }

  const config = getButtonConfig(displayedState)
  const action = getOnPressAction(displayedState)

  return (
    <Button
      block
      haptic
      disabled={config.disabled}
      loading={config.loading}
      variant={config.variant ?? "fillDark"}
      onPress={action ? () => onPress(action) : undefined}
    >
      {config.label}
    </Button>
  )
}
