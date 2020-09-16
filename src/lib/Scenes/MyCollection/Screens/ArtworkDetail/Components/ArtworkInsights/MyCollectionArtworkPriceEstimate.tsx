import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Flex, InfoCircleIcon, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Field } from "../Field"

interface MyCollectionArtworkPriceEstimateProps {}

const MyCollectionArtworkPriceEstimate: React.FC<MyCollectionArtworkPriceEstimateProps> = (props) => {
  return (
    <ScreenMargin>
      <Flex flexDirection="row">
        <Text variant="mediumText" mr={0.5}>
          Price estimate
        </Text>
        <InfoCircleIcon />
      </Flex>
      <Text>Based on 23 comparable works</Text>

      <Spacer mt={1} />

      <Flex flexDirection="row" alignItems="flex-end">
        <Text variant="largeTitle" mr={0.5}>
          $43,100
        </Text>
        <Text variant="small" color="black60">
          Median
        </Text>
      </Flex>

      <Spacer mt={0.5} />

      <Field label="Sold price range" value="$10k – $96k" />
      <Field label="Your price paid for this work" value="€9,900" />
    </ScreenMargin>
  )
}

export const MyCollectionArtworkPriceEstimateFragmentContainer = createFragmentContainer(
  MyCollectionArtworkPriceEstimate,
  {
    artwork: graphql`
      fragment MyCollectionArtworkPriceEstimate_artwork on Artwork {
        id
      }
    `,
  }
)
