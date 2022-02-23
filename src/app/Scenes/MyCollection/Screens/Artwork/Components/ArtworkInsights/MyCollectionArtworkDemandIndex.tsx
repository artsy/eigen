import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { MyCollectionArtworkDemandIndex_artwork$key } from "__generated__/MyCollectionArtworkDemandIndex_artwork.graphql"
import { MyCollectionArtworkDemandIndex_marketPriceInsights$key } from "__generated__/MyCollectionArtworkDemandIndex_marketPriceInsights.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { TriangleDown } from "app/Icons/TriangleDown"
import { Flex, Spacer, Text } from "palette"
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

  const artwork = useFragment<MyCollectionArtworkDemandIndex_artwork$key>(
    artworkFragment,
    props.artwork
  )

  const marketPriceInsights = useFragment<MyCollectionArtworkDemandIndex_marketPriceInsights$key>(
    marketPriceInsightsFragment,
    props.marketPriceInsights
  )

  if (!artwork || !marketPriceInsights?.demandRank) {
    return null
  }

  const demandRank = Number((marketPriceInsights.demandRank * 10).toFixed(2))

  return (
    <Flex mb={6}>
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
      <Spacer my={1} />
      <DemandRankDetails demandRank={demandRank} />
    </Flex>
  )
}

const DemandRankDetails: React.FC<{ demandRank: number }> = ({ demandRank }) => {
  const title = getDemandRankTitle(demandRank)

  const details =
    demandRank >= 7 &&
    "Demand is higher than the supply available in the market and sale price exceeds estimates."

  return (
    <Flex>
      <Text textAlign="center">{title}</Text>

      <Text variant="xs" color="black60" textAlign="center">
        {details}
      </Text>
    </Flex>
  )
}

const DemandRankScale: React.FC<{ demandRank: number }> = ({ demandRank }) => {
  let width = demandRank * 10
  if (width > 100) {
    width = 100
  }

  const adjustedDemandRank = demandRank.toFixed(1) === "10.0" ? "9.9" : demandRank.toFixed(1)

  return (
    <>
      <Flex>
        <Text variant="lg" color="blue100">
          {adjustedDemandRank}
        </Text>
      </Flex>
      <ProgressBar width={width} />
      <Spacer />
      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="xs" color="black60">
          0
        </Text>
        <Text variant="xs" color="black60">
          10
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
          colors={["rgba(243, 240, 248, 2.6)", `rgba(110, 30, 255, ${opacity})`]}
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

const getDemandRankTitle = (demandRank: number) => {
  switch (true) {
    case demandRank >= 9: {
      return "Very Strong Demand (> 9.0)"
    }
    case demandRank >= 7 && demandRank < 9: {
      return "Strong Demand (7.0 – 9.0)"
    }
    case demandRank >= 4 && demandRank < 7: {
      return "Stable Market (4.0 – 7.0)"
    }
    case demandRank < 4: {
      return "Less Active Market  (< 4.0)"
    }
  }
}

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
