import {
  bullet,
  FairIcon,
  Flex,
  LinkText,
  Text,
  TrendingIcon,
  VerifiedIcon,
} from "@artsy/palette-mobile"

import { ArtworkCollectorSignalsRow_artwork$key } from "__generated__/ArtworkCollectorSignalsRow_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { DateTime } from "luxon"
import { graphql, useFragment } from "react-relay"

interface Props {
  artwork: ArtworkCollectorSignalsRow_artwork$key
}

export const ArtworkCollectorSignalsRow: React.FC<Props> = ({ artwork }) => {
  const enableCuratorsPicksAndInterestSignals = useFeatureFlag(
    "AREnableCuratorsPicksAndInterestSignals"
  )

  const { collectorSignals } = useFragment(fragment, artwork)
  if (!collectorSignals) {
    return null
  }

  const { curatorsPick, increasedInterest, runningShow } = collectorSignals
  if (!curatorsPick && !increasedInterest && !runningShow) {
    return null
  }

  let singalTitle: string = null
  let signalDescription: string = null
  let SignalIcon = null
  let href: string = null

  switch (true) {
    case curatorsPick && enableCuratorsPicksAndInterestSignals: {
      singalTitle = "Curators’ Pick"
      signalDescription = "Hand selected by Artsy curators this week"
      SignalIcon = VerifiedIcon
      break
    }
    case increasedInterest && enableCuratorsPicksAndInterestSignals: {
      singalTitle = "Increased Interest"
      signalDescription = "Based on collector activity in the past 14 days"
      SignalIcon = TrendingIcon
      break
    }
    case !!runningShow: {
      if (!runningShow.startAt || !runningShow.endAt) {
        break
      }
      const showStartsAt = DateTime.fromISO(runningShow.startAt).toFormat("MMM d")
      const showEndAt = DateTime.fromISO(runningShow.endAt).toFormat("MMM d")
      singalTitle = `Showing now ${bullet} ${showStartsAt}-${showEndAt}`
      SignalIcon = FairIcon
      href = runningShow.href || "#"
      signalDescription = runningShow.name
    }
  }

  if (!singalTitle) {
    return null
  }

  return (
    <Flex flexDirection="row" pt={4} pb={2}>
      <SignalIcon mr={0.5} fill="black60" height={25} width={25} />

      <Flex flexDirection="column">
        <Text variant="sm-display" color="black100">
          {singalTitle}
        </Text>

        {href ? (
          <LinkText variant="sm" color="black60" onPress={() => navigate(href)}>
            {signalDescription}
          </LinkText>
        ) : (
          <Text variant="sm" color="black60">
            {signalDescription}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtworkCollectorSignalsRow_artwork on Artwork {
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
