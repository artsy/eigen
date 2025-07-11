import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { TriangleDownIcon } from "@artsy/icons/native"
import { Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { MyCollectionArtworkDemandIndex_artwork$key } from "__generated__/MyCollectionArtworkDemandIndex_artwork.graphql"
import { MyCollectionArtworkDemandIndex_artworkPriceInsights$key } from "__generated__/MyCollectionArtworkDemandIndex_artworkPriceInsights.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import HighDemandIcon from "app/Components/Icons/HighDemandIcon"
import { DimensionValue } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface MyCollectionArtworkDemandIndexProps {
  artwork: MyCollectionArtworkDemandIndex_artwork$key
  marketPriceInsights: MyCollectionArtworkDemandIndex_artworkPriceInsights$key
}

export const MyCollectionArtworkDemandIndex: React.FC<MyCollectionArtworkDemandIndexProps> = (
  props
) => {
  const { trackEvent } = useTracking()

  const artwork = useFragment(artworkFragment, props.artwork)

  const marketPriceInsights = useFragment(artworkPriceInsightsFragment, props.marketPriceInsights)

  const { demandRankDisplayText } = marketPriceInsights
  if (!artwork || !marketPriceInsights?.demandRank) {
    return null
  }

  const demandRank = Number((marketPriceInsights.demandRank * 10).toFixed(2))

  return (
    <Flex mt={1}>
      <InfoButton
        title="Demand index"
        modalContent={
          <Text>
            Overall strength of demand for this artist and medium combination. Based on the last 36
            months of auction sale data from top commercial auction houses.
          </Text>
        }
        onPress={() => trackEvent(tracks.tappedInfoBubble(artwork?.internalID, artwork?.slug))}
      />

      <Spacer y={1} />
      <DemandRankScale demandRank={demandRank} demandRankDisplayText={demandRankDisplayText} />
      <Separator my={4} borderColor="mono10" />
    </Flex>
  )
}

const DemandRankScale: React.FC<{
  demandRank: number
  demandRankDisplayText: string | null | undefined
}> = ({ demandRank, demandRankDisplayText }) => {
  let width = demandRank * 10
  if (width > 100) {
    width = 100
  }
  const adjustedDemandRank = demandRank.toFixed(1) === "10.0" ? "9.9" : demandRank.toFixed(1)

  const isHighDemand = Number(demandRank) >= 9
  const color = demandRank >= 7 ? "blue100" : "mono60"

  return (
    <>
      <Flex>
        <Text color={color} variant="xl">
          {adjustedDemandRank}
        </Text>
        <Flex flexDirection="row" alignItems="center" mb={1}>
          {!!isHighDemand && <HighDemandIcon style={{ marginTop: 2, marginRight: 2 }} />}
          <Text color={color}>{demandRankDisplayText}</Text>
        </Flex>
      </Flex>
      <ProgressBar width={width} />
      <Spacer />
      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="xs" color="mono60">
          0.0
        </Text>
        <Text variant="xs" color="mono60">
          10.0
        </Text>
      </Flex>
    </>
  )
}

const ProgressBar: React.FC<{ width: number }> = ({ width }) => {
  const pctWidth = width + "%"
  const opacity = width / 100
  const gradientWidth = pctWidth as DimensionValue

  return (
    <>
      <Flex width="100%" position="relative" height={10} left={-6}>
        <Flex left={pctWidth} position="absolute">
          <TriangleDownIcon />
        </Flex>
      </Flex>
      <Flex height={24} width="100%" bg="mono5">
        <LinearGradient
          colors={["rgba(16, 35, 215, 0.5)", `rgba(16, 35, 215, ${opacity})`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: gradientWidth,
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

const artworkPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkDemandIndex_artworkPriceInsights on ArtworkPriceInsights {
    demandRank
    demandRankDisplayText
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
