import {
  bullet,
  FairIcon,
  Flex,
  LinkText,
  Text,
  TrendingIcon,
  VerifiedIcon,
} from "@artsy/palette-mobile"

import { ArtworkDetailsCollectorSignal_artwork$key } from "__generated__/ArtworkDetailsCollectorSignal_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { DateTime } from "luxon"
import { graphql, useFragment } from "react-relay"

interface Props {
  artwork: ArtworkDetailsCollectorSignal_artwork$key
}

export const ArtworkDetailsCollectorSignal: React.FC<Props> = ({ artwork }) => {
  const enableCuratorsPicksAndInterestSignals = useFeatureFlag(
    "AREnableCuratorsPicksAndInterestSignals"
  )

  const { collectorSignals } = useFragment(fragment, artwork)

  if (
    !collectorSignals ||
    (!collectorSignals.curatorsPick &&
      !collectorSignals.increasedInterest &&
      !collectorSignals.runningShow)
  ) {
    return null
  }

  const { curatorsPick, increasedInterest, runningShow } = collectorSignals

  let singalTitle: string | null = null
  let signalDescription: string | null = null
  let href: string | null = null
  let SignalIcon = FairIcon

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
      if (
        !runningShow?.startAt ||
        !runningShow?.endAt ||
        !runningShow?.href ||
        !runningShow?.name
      ) {
        break
      }
      const showStartsAt = DateTime.fromISO(runningShow.startAt).toFormat("MMM d")
      const showEndAt = DateTime.fromISO(runningShow.endAt).toFormat("MMM d")
      singalTitle = `Showing now ${bullet} ${showStartsAt}-${showEndAt}`
      href = runningShow?.href
      signalDescription = runningShow?.name
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
          <LinkText variant="sm" color="black60" onPress={() => navigate(href || "#")}>
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
  fragment ArtworkDetailsCollectorSignal_artwork on Artwork {
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