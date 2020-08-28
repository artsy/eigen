import { MyCollectionArtworkDetailQuery } from "__generated__/MyCollectionArtworkDetailQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Flex, Join, Sans, Separator, Spacer } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, useQuery } from "relay-hooks"
import { ArtworkMeta } from "./Components/ArtworkMeta"
import { AuctionResults } from "./Components/AuctionResults"
import { ConsignCTA } from "./Components/ConsignCTA"
import { Insights } from "./Components/Insights"

/**
 * TODO: This will need to be a relay refetch container, because if the edit
 * button is pressed and changes are made in the modal, on complete the modal
 * slides down revealing the unedited view.
 *
 * On "edit > done" an event will need to be fired that calls `relay.refetch()`.
 * communicating back with this container that sits under the edit modal.
 */

export const MyCollectionArtworkDetail: React.FC<{ artworkID: string }> = ({ artworkID }) => {
  const dimensions = useScreenDimensions()
  const navActions = AppStore.actions.myCollection.navigation
  const artworkActions = AppStore.actions.myCollection.artwork

  const { props, error } = useQuery<MyCollectionArtworkDetailQuery>(
    graphql`
      query MyCollectionArtworkDetailQuery($artworkID: String!) {
        artwork(id: $artworkID) {
          internalID
          id
          artistNames
          artist {
            internalID
          }
          medium
          title
        }
      }
    `,
    {
      artworkID,
    }
  )

  if (!props) {
    // FIXME: Add Skeleton
    return null
  }
  if (error) {
    // FIXME: Handle error
    throw error
  }

  // FIXME: UI fill in props
  const artwork = {
    demand: "Strong demand",
    estimate: "$4,500 - $445,000",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/ng_LZVBhBb2805HMUIl6UQ/:version.jpg",
    },
    hasInsights: true,
    hasAuctionResults: true,
    ...(props as any).artwork,
  }

  return (
    <ScrollView>
      <FancyModalHeader
        leftButtonText=""
        rightButtonText="Edit"
        onRightButtonPress={() => {
          console.log("**", artwork)
          artworkActions.startEditingArtwork(artwork)
        }}
      ></FancyModalHeader>
      <Join separator={<Spacer my={1} />}>
        <OpaqueImageView
          // TODO: figure out if "normalized" is the correct version
          imageURL={artwork.image.url.replace(":version", "normalized")}
          height={200}
          width={dimensions.width}
        />

        <ScreenMargin>
          <ArtworkMeta artwork={artwork} />
        </ScreenMargin>

        <ConsignCTA />

        <ScreenMargin>
          <Insights />
        </ScreenMargin>

        <Separator />

        <ScreenMargin>
          <AuctionResults />
        </ScreenMargin>

        <Separator />

        <ScreenMargin>
          <Join separator={<Spacer my={1} />}>
            <Sans size="6">Why sell with Artsy?</Sans>
            <WhySellStep
              step={1}
              title="Simple Steps"
              description="Submit your work once, pick the best offer, and ship the work when it sells."
            />
            <WhySellStep
              step={2}
              title="Industry Expertise"
              description="Receive virtual valuation and expert guidance on the best sales strategies."
            />
            <WhySellStep
              step={3}
              title="Global Reach"
              description="Your work will reach the world's collectors, galleries, and auction houses."
            />
          </Join>
        </ScreenMargin>

        <ScreenMargin>
          <Button size="large" block onPress={() => navActions.navigateToConsign()}>
            Submit this work
          </Button>

          <Spacer my={0.5} />

          <Button size="large" variant="secondaryGray" block>
            Learn more
          </Button>
        </ScreenMargin>

        <Spacer my={2} />
      </Join>
    </ScrollView>
  )
}

const WhySellStep: React.FC<{ step: number; title: string; description: string }> = ({ step, title, description }) => {
  return (
    <Flex flexDirection="row">
      <Box mr={2}>
        <Sans size="3">{step}</Sans>
      </Box>
      <Box>
        <Sans size="3">{title}</Sans>
        <Sans size="3" color="black60">
          {description}
        </Sans>
      </Box>
    </Flex>
  )
}
