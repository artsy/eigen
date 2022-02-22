import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { OldMyCollectionArtworkDemandIndex_artwork } from "__generated__/OldMyCollectionArtworkDemandIndex_artwork.graphql"
import { OldMyCollectionArtworkDemandIndex_marketPriceInsights } from "__generated__/OldMyCollectionArtworkDemandIndex_marketPriceInsights.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { TriangleDown } from "app/Icons/TriangleDown"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { Box, Flex, Spacer, Text } from "palette"
import React from "react"
import LinearGradient from "react-native-linear-gradient"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface OldMyCollectionArtworkDemandIndexProps {
  artwork: OldMyCollectionArtworkDemandIndex_artwork
  marketPriceInsights: OldMyCollectionArtworkDemandIndex_marketPriceInsights
}

const OldMyCollectionArtworkDemandIndex: React.FC<OldMyCollectionArtworkDemandIndexProps> = ({
  artwork,
  marketPriceInsights,
}) => {
  const { trackEvent } = useTracking()
  if (!artwork || !marketPriceInsights) {
    return null
  }

  const demandRank = Number((marketPriceInsights.demandRank! * 10).toFixed(2))

  return (
    <ScreenMargin>
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

      <Spacer my={0.5} />
      <DemandRankScale demandRank={demandRank} />
      <Spacer my={1} />
      <DemandRankDetails demandRank={demandRank} />
    </ScreenMargin>
  )
}

const DemandRankDetails: React.FC<{ demandRank: number }> = ({ demandRank }) => {
  const Bubble: React.FC<{ title: string }> = ({ title }) => (
    <Box>
      <Text>{title}</Text>
    </Box>
  )

  const getContent = () => {
    switch (true) {
      case demandRank >= 9: {
        return <Bubble title="Very Strong Demand (> 9.0)" />
      }
      case demandRank >= 7 && demandRank < 9: {
        return <Bubble title="Strong Demand (7.0 – 9.0)" />
      }
      case demandRank >= 4 && demandRank < 7: {
        return <Bubble title="Stable Market (4.0 – 7.0)" />
      }
      case demandRank < 4: {
        return <Bubble title="Less Active Market  (< 4.0)" />
      }
    }
  }
  const content = getContent()
  return <>{content}</>
}

const DemandRankScale: React.FC<{ demandRank: number }> = ({ demandRank }) => {
  let width = demandRank * 10
  if (width > 100) {
    width = 100
  }

  let adjustedDemandRank = demandRank.toFixed(1)
  if (adjustedDemandRank === "10.0") {
    adjustedDemandRank = "9.9"
  }

  return (
    <>
      <Box>
        <Text variant="lg" color="blue100">
          {adjustedDemandRank}
        </Text>
      </Box>
      <ProgressBar width={width} />
      <Spacer my={0.3} />
      <Flex flexDirection="row" justifyContent="space-between">
        <Text>0</Text>
        <Text>10</Text>
      </Flex>
    </>
  )
}

const ProgressBar: React.FC<{ width: number }> = ({ width }) => {
  const pctWidth = width + "%"
  const opacity = width / 100

  return (
    <>
      <Box width="100%" position="relative" height={10} left={-6}>
        <Box left={pctWidth} position="absolute">
          <TriangleDown />
        </Box>
      </Box>
      <Box height={24} width="100%" bg="black5">
        <LinearGradient
          colors={["rgba(243, 240, 248, 2.6)", `rgba(110, 30, 255, ${opacity})`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: pctWidth,
            height: 24,
          }}
        />
      </Box>
    </>
  )
}

export const OldMyCollectionArtworkDemandIndexFragmentContainer = createFragmentContainer(
  OldMyCollectionArtworkDemandIndex,
  {
    marketPriceInsights: graphql`
      fragment OldMyCollectionArtworkDemandIndex_marketPriceInsights on MarketPriceInsights {
        demandRank
      }
    `,
    artwork: graphql`
      fragment OldMyCollectionArtworkDemandIndex_artwork on Artwork {
        internalID
        slug
      }
    `,
  }
)

export const tests = {
  DemandRankScale,
  DemandRankDetails,
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
