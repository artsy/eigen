import { MyCollectionArtworkInsights_artwork } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { Divider } from "lib/Components/Bidding/Components/Divider"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Box, Flex, InfoCircleIcon, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Field } from "./Field"

interface MyCollectionArtworkInsightsProps {
  artwork: MyCollectionArtworkInsights_artwork
}

// TODO: Add fancymodals for info icon clicks

export const MyCollectionArtworkInsights: React.FC<MyCollectionArtworkInsightsProps> = () => {
  return (
    <>
      <ScreenMargin>
        <Text variant="title">Price and market insights</Text>
        <Text variant="small" color="black60">
          For this artist, category, and size combination
        </Text>
      </ScreenMargin>

      <Spacer mt={3} />

      <ScreenMargin>
        <Flex flexDirection="row">
          <Text variant="mediumText" mr={0.5}>
            Demand index
          </Text>
          <InfoCircleIcon />
        </Flex>
        <Box>
          <Text variant="largeTitle" color="purple100">
            8.23
          </Text>
        </Box>
        <Flex flexDirection="row" justifyContent="space-between">
          <Text>0.0</Text>
          <Text>Progress bar..</Text>
          <Text>10.0</Text>
        </Flex>

        <Spacer my={1} />

        <Box>
          <Text>Strong demand (6.0–8.5)</Text>
          <Text color="black60">
            Demand is higher than the supply available in the market and sale price exceeds estimates.
          </Text>
        </Box>
      </ScreenMargin>

      <ScreenMargin my={3}>
        <Divider />
      </ScreenMargin>

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

      <ScreenMargin mt={2} mb={3}>
        <Divider />
      </ScreenMargin>

      <ScreenMargin>
        <Flex flexDirection="row">
          <Text variant="mediumText" mr={0.5}>
            Artist market
          </Text>
          <InfoCircleIcon />
        </Flex>
        <Text>Based on 36 months of auction data</Text>

        <Spacer mt={1} />

        <Field label="Avg. Annual Value Sold" value="$5,346,000" />
        <Field label="Avg. Annual Lots Sold" value="25 - 50" />
        <Field label="Sell-through Rate" value="94.5%" />
        <Field label="Median Sale Price to Estimate" value="1.70x" />
        <Field label="Liquidity" value="Very high" />
        <Field label="1-Year Trend" value="Flat" />
      </ScreenMargin>

      <ScreenMargin mt={2} mb={3}>
        <Divider />
      </ScreenMargin>

      <ScreenMargin>
        <Flex flexDirection="row">
          <Text variant="mediumText" mr={0.5}>
            Recent auction results
          </Text>
          <InfoCircleIcon />
        </Flex>

        <Spacer my={0.5} />

        <Box my={0.5}>
          <Flex flexDirection="row" justifyContent="space-between" width="100%">
            <Flex flexDirection="row">
              <Box width={45} height={45} bg="black60" mr={0.5} />
              <Flex flexDirection="column">
                <Text numberOfLines={1}>Untitled (Doctor and Nu...</Text>
                <Text>Sold Aug 3, 2020</Text>
              </Flex>
            </Flex>
            <Box>
              <Text>$10,625</Text>
            </Box>
          </Flex>
        </Box>
        <Box my={0.5}>
          <Flex flexDirection="row" justifyContent="space-between" width="100%">
            <Flex flexDirection="row">
              <Box width={45} height={45} bg="black60" mr={0.5} />
              <Flex flexDirection="column">
                <Text numberOfLines={1}>Untitled (Doctor and Nu...</Text>
                <Text>Sold Aug 3, 2020</Text>
              </Flex>
            </Flex>
            <Box>
              <Text>$10,625</Text>
            </Box>
          </Flex>
        </Box>
        <Box my={0.5}>
          <Flex flexDirection="row" justifyContent="space-between" width="100%">
            <Flex flexDirection="row">
              <Box width={45} height={45} bg="black60" mr={0.5} />
              <Flex flexDirection="column">
                <Text numberOfLines={1}>Untitled (Doctor and Nu...</Text>
                <Text>Sold Aug 3, 2020</Text>
              </Flex>
            </Flex>
            <Box>
              <Text>$10,625</Text>
            </Box>
          </Flex>
        </Box>

        <Spacer my={1} />

        <Box>
          <CaretButton
            // onPress={() => navActions.navigateToViewAllArtworkDetails({ passProps: artwork })}
            text="Explore auction results"
          />
        </Box>
      </ScreenMargin>

      <Box my={3}>
        <Divider />
      </Box>

      <ScreenMargin>
        <Text variant="mediumText">Latest Articles</Text>
        <Box my={0.5}>
          <Flex flexDirection="row" justifyContent="space-between">
            <Box pr={1} maxWidth="80%">
              <Flex flexDirection="row">
                <Text style={{ flexShrink: 1 }}>
                  This Artwork Changed My Life: Cindy Sherman’s “Untitled Film Stills”
                </Text>
              </Flex>
              <Text color="black60" my={0.5}>
                Feb 4, 2020
              </Text>
            </Box>
            <Box width={80} height={60} bg="black60" />
          </Flex>
        </Box>
        <Box my={0.5}>
          <Flex flexDirection="row" justifyContent="space-between">
            <Box pr={1} maxWidth="80%">
              <Flex flexDirection="row">
                <Text style={{ flexShrink: 1 }}>
                  This Artwork Changed My Life: Cindy Sherman’s “Untitled Film Stills”
                </Text>
              </Flex>
              <Text color="black60" my={0.5}>
                Feb 4, 2020
              </Text>
            </Box>
            <Box width={80} height={60} bg="black60" />
          </Flex>
        </Box>
        <Box my={0.5}>
          <Flex flexDirection="row" justifyContent="space-between">
            <Box pr={1} maxWidth="80%">
              <Flex flexDirection="row">
                <Text style={{ flexShrink: 1 }}>
                  This Artwork Changed My Life: Cindy Sherman’s “Untitled Film Stills”
                </Text>
              </Flex>
              <Text color="black60" my={0.5}>
                Feb 4, 2020
              </Text>
            </Box>
            <Box width={80} height={60} bg="black60" />
          </Flex>
        </Box>

        <Spacer my={1} />

        <Box>
          <CaretButton
            // onPress={() => navActions.navigateToViewAllArtworkDetails({ passProps: artwork })}
            text="See all articles"
          />
        </Box>
      </ScreenMargin>
    </>
  )
}

export const MyCollectionArtworkInsightsFragmentContainer = createFragmentContainer(MyCollectionArtworkInsights, {
  artwork: graphql`
    fragment MyCollectionArtworkInsights_artwork on Artwork {
      id
    }
  `,
})
