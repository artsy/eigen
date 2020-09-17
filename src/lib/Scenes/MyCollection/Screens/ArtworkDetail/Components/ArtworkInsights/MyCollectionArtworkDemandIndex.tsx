import { MyCollectionArtworkDemandIndex_marketPriceInsights } from "__generated__/MyCollectionArtworkDemandIndex_marketPriceInsights.graphql"
import { TriangleDown } from "lib/Icons/TriangleDown"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Box, Flex, InfoCircleIcon, Spacer, Text } from "palette"
import React from "react"
import LinearGradient from "react-native-linear-gradient"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkDemandIndexProps {
  marketPriceInsights: MyCollectionArtworkDemandIndex_marketPriceInsights
}

const MyCollectionArtworkDemandIndex: React.FC<MyCollectionArtworkDemandIndexProps> = (_props) => {
  return (
    <ScreenMargin>
      <Flex flexDirection="row">
        <Text variant="mediumText" mr={0.5}>
          Demand index
        </Text>
        <InfoCircleIcon />
      </Flex>

      <Spacer my={0.5} />
      <DemandScale scale={8.25} />
      <Spacer my={1} />

      <Box>
        <Text>Strong demand (6.0–8.5)</Text>
        <Text color="black60">
          Demand is higher than the supply available in the market and sale price exceeds estimates.
        </Text>
      </Box>
    </ScreenMargin>
  )
}

const DemandScale: React.FC<{ scale: number }> = (props) => {
  const scale = props.scale
  let width = scale * 10
  if (width > 100) {
    width = 100
  }

  return (
    <>
      <Box>
        <Text variant="largeTitle" color="purple100">
          {scale}
        </Text>
      </Box>
      <ProgressBar width={width} />
      <Spacer my={0.3} />
      <Flex flexDirection="row" justifyContent="space-between">
        <Text>0.0</Text>
        <Text>{scale}</Text>
      </Flex>
    </>
  )
}

const ProgressBar: React.FC<{ width: number }> = ({ width }) => {
  const pctWidth = width + "%"

  return (
    <>
      <Box width="100%" position="relative" height={10} left={-6}>
        <TriangleDown left={pctWidth} position="absolute" />
      </Box>
      <Box height={20} width="100%" bg="black5">
        <LinearGradient
          colors={["rgba(243, 240, 248, 2.6)", "rgba(110, 30, 255, 1)"]}
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

export const MyCollectionArtworkDemandIndexFragmentContainer = createFragmentContainer(MyCollectionArtworkDemandIndex, {
  marketPriceInsights: graphql`
    fragment MyCollectionArtworkDemandIndex_marketPriceInsights on MarketPriceInsights {
      annualLotsSold
    }
  `,
})
