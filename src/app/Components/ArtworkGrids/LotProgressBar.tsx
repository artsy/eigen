import {
  ArtworkAuctionProgressBar,
  ArtworkAuctionProgressBarProps,
} from "../Bidding/Components/ArtworkAuctionProgressBar"
import { CountdownTimerProps } from "../Countdown/CountdownTimer"

export interface LotProgressBarProps extends ArtworkAuctionProgressBarProps {
  duration: CountdownTimerProps["duration"]
}

export const LotProgressBar: React.FC<LotProgressBarProps> = (props) => {
  const { duration } = props
  if (!duration) {
    return null
  }
  const time = {
    days: duration.asDays(),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  }

  const hasFinishedRunning =
    Object.values(time).reduce((accumulator, timeUnit) => accumulator + timeUnit, 0) <= 0

  if (hasFinishedRunning) {
    return null
  }

  return <ArtworkAuctionProgressBar {...props} />
}
