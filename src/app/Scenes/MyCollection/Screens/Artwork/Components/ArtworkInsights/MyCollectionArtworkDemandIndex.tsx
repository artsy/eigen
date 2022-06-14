import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { MyCollectionArtworkDemandIndex_artwork$key } from "__generated__/MyCollectionArtworkDemandIndex_artwork.graphql"
import { MyCollectionArtworkDemandIndex_marketPriceInsights$key } from "__generated__/MyCollectionArtworkDemandIndex_marketPriceInsights.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import HighDemandIcon from "app/Icons/HighDemandIcon"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Flex, Spacer, Text, TriangleDown } from "palette"
import React from "react"
import LinearGradient from "react-native-linear-gradient"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface MyCollectionArtworkDemandIndexProps {
  artwork: MyCollectionArtworkDemandIndex_artwork$key
  marketPriceInsights: MyCollectionArtworkDemandIndex_marketPriceInsights$key
}

export const MyCollectionArtworkDemandIndex: React.FC<MyCollectionArtworkDemandIndexProps> = (
  props
) => {
  const { trackEvent } = useTracking()

  const artwork = useFragment(artworkFragment, props.artwork)

  const marketPriceInsights = useFragment(marketPriceInsightsFragment, props.marketPriceInsights)

  if (!artwork || !marketPriceInsights?.demandRank) {
    return null
  }

  const demandRank = Number((marketPriceInsights.demandRank * 10).toFixed(2))

  return (
    <Flex mb={2}>
      <InfoButton
        title="Demand index"
        modalContent={
          <>
            <Spacer my={1} />
            <Text>
              Overall strength of demand for this artist and medium combination. Based on the last
              36 months of auction sale data from top commercial auction houses.
            </Text>
          </>
        }
        onPress={() => trackEvent(tracks.tappedInfoBubble(artwork?.internalID, artwork?.slug))}
      />

      <Spacer my={1} />
      <DemandRankScale demandRank={demandRank} />
    </Flex>
  )
}

const DemandRankScale: React.FC<{ demandRank: number }> = ({ demandRank }) => {
  const enableDemandIndexHints = useFeatureFlag("ARShowMyCollectionDemandIndexHints")

  let width = demandRank * 10
  if (width > 100) {
    width = 100
  }
  const adjustedDemandRank = demandRank.toFixed(1) === "10.0" ? "9.9" : demandRank.toFixed(1)

  const isHighDemand = Number(demandRank) >= 9
  const color = demandRank >= 7 ? "blue100" : "black60"

  return (
    <>
      <Flex>
        <Text color={color} variant="xl">
          {adjustedDemandRank}
        </Text>
        {!!enableDemandIndexHints && (
          <Flex flexDirection="row" alignItems="center" mb={1}>
            {!!isHighDemand && <HighDemandIcon style={{ marginTop: 2, marginRight: 2 }} />}
            <Text color={color}>{getDemandRankText(demandRank)}</Text>
          </Flex>
        )}
      </Flex>
      <ProgressBar width={width} />
      <Spacer />
      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="xs" color="black60">
          0.0
        </Text>
        <Text variant="xs" color="black60">
          10.0
        </Text>
      </Flex>
    </>
  )
}

const ProgressBar: React.FC<{ width: number }> = ({ width }) => {
  const pctWidth = width + "%"
  const opacity = width / 100

  return (
    <>
      <Flex width="100%" position="relative" height={10} left={-6}>
        <Flex left={pctWidth} position="absolute">
          <TriangleDown />
        </Flex>
      </Flex>
      <Flex height={24} width="100%" bg="black5">
        <LinearGradient
          colors={["rgba(16, 35, 215, 0.5)", `rgba(16, 35, 215, ${opacity})`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: pctWidth,
            height: 24,
          }}
        />
      </Flex>
    </>
  )
}

const getDemandRankText = (demandRank: number) => {
  if (demandRank >= 9) {
    return "High Demand"
  } else if (demandRank >= 7) {
    return "Active Demand"
  } else if (demandRank >= 4) {
    return "Moderate Demand"
  }

  return "Less Active Demand"
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkDemandIndex_artwork on Artwork {
    internalID
    slug
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkDemandIndex_marketPriceInsights on MarketPriceInsights {
    demandRank
  }
`

const tracks = {
  tappedInfoBubble: (internalID: string, slug: string): TappedInfoBubble => ({
    action: ActionType.tappedInfoBubble,
    context_module: ContextModule.myCollectionArtwork,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
    subject: "demandIndex",
  }),
}
