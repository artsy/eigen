import { FireIcon, FairIcon, TrendingIcon } from "@artsy/icons/native"
import { bullet } from "@artsy/palette-mobile"
import { useCollectorSignal_artwork$key } from "__generated__/useCollectorSignal_artwork.graphql"
import { DateTime } from "luxon"
import { graphql, useFragment } from "react-relay"

type UseCollectorSignalResult =
  | {
      signalTitle?: null
      signalDescription?: null
      href?: null
      SignalIcon?: null
    }
  | {
      signalTitle: string
      signalDescription: string
      href?: string | null
      SignalIcon: typeof FireIcon
    }

interface UseCollectorSignalProps {
  artwork?: useCollectorSignal_artwork$key | null
}

export const useCollectorSignal = ({
  artwork,
}: UseCollectorSignalProps): UseCollectorSignalResult => {
  const data = useFragment(fragment, artwork)

  if (
    !data ||
    !data.collectorSignals ||
    (!data.collectorSignals.curatorsPick &&
      !data.collectorSignals.increasedInterest &&
      !data.collectorSignals.runningShow)
  ) {
    return empty
  }

  const { curatorsPick, increasedInterest, runningShow } = data.collectorSignals

  if (curatorsPick) {
    return {
      signalTitle: "Curators’ Pick",
      signalDescription: "Hand selected by Artsy curators this week",
      SignalIcon: FireIcon,
    }
  }

  if (increasedInterest) {
    return {
      signalTitle: "Increased Interest",
      signalDescription: "Based on collector activity in the past 14 days",
      SignalIcon: TrendingIcon,
    }
  }

  if (
    runningShow &&
    runningShow.startAt &&
    runningShow.endAt &&
    runningShow.href &&
    runningShow.name
  ) {
    const showStartsAt = DateTime.fromISO(runningShow.startAt).toFormat("MMM d")
    const showEndAt = DateTime.fromISO(runningShow.endAt).toFormat("MMM d")
    return {
      signalTitle: `Showing now ${bullet} ${showStartsAt}-${showEndAt}`,
      href: runningShow.href,
      signalDescription: runningShow.name,
      SignalIcon: FairIcon,
    }
  }

  return empty
}

const fragment = graphql`
  fragment useCollectorSignal_artwork on Artwork {
    collectorSignals {
      curatorsPick
      increasedInterest
      runningShow {
        endAt
        href
        name
        startAt
      }
    }
  }
`

const empty = {
  signalTitle: null,
  signalDescription: null,
  SignalIcon: null,
}
