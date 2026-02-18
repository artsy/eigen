import { FireIcon, FairIcon, TrendingIcon } from "@artsy/icons/native"
import { bullet } from "@artsy/palette-mobile"
import { useCollectorSignal_artwork$key } from "__generated__/useCollectorSignal_artwork.graphql"
import { DateTime } from "luxon"
import { graphql, useFragment } from "react-relay"

type EmptyCollectorSignal = {
  signalTitle?: null
  signalDescription?: null
  href?: null
  SignalIcon?: null
  hasCollectorSignal: false
}

type CollectorSignal = {
  signalTitle: string
  signalDescription: string
  href?: string | null
  SignalIcon: typeof FireIcon
  hasCollectorSignal: true
}

type UseCollectorSignalResult = EmptyCollectorSignal | CollectorSignal

interface UseCollectorSignalProps {
  artwork?: useCollectorSignal_artwork$key | null
}

export const useCollectorSignal = ({
  artwork,
}: UseCollectorSignalProps): UseCollectorSignalResult => {
  const data = useFragment(fragment, artwork)

  const { curatorsPick, increasedInterest, runningShow } = data?.collectorSignals ?? {}

  if (!curatorsPick && !increasedInterest && !runningShow) {
    return NO_COLLECTOR_SIGNALS
  }

  if (curatorsPick) {
    return {
      signalTitle: "Curators’ Pick",
      signalDescription: "Hand selected by Artsy curators this week",
      SignalIcon: FireIcon,
      hasCollectorSignal: true,
    }
  }

  if (increasedInterest) {
    return {
      signalTitle: "Increased Interest",
      signalDescription: "Based on collector activity in the past 14 days",
      SignalIcon: TrendingIcon,
      hasCollectorSignal: true,
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
      hasCollectorSignal: true,
    }
  }

  return NO_COLLECTOR_SIGNALS
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

const NO_COLLECTOR_SIGNALS: EmptyCollectorSignal = {
  signalTitle: null,
  signalDescription: null,
  SignalIcon: null,
  hasCollectorSignal: false,
}
