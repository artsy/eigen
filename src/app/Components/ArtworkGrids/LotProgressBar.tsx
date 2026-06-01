import {
  ArtworkAuctionProgressBar,
  ArtworkAuctionProgressBarProps,
} from "app/Components/Bidding/Components/ArtworkAuctionProgressBar"
import { CountdownTimerProps } from "app/Components/Countdown/CountdownTimer"

export interface LotProgressBarProps extends ArtworkAuctionProgressBarProps {
  duration: CountdownTimerProps["duration"]
}

export const LotProgressBar: React.FC<LotProgressBarProps> = (props) => {
  const { duration } = props

  if (!duration) {
    return null
  }

  const hasFinishedRunning = duration.toMillis() <= 0

  if (hasFinishedRunning) {
    return null
  }

  return <ArtworkAuctionProgressBar {...props} />
}
