import { MyCollectionArtworkDetailQuery } from "__generated__/MyCollectionArtworkDetailQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { Box, Button, Flex, Join, Sans, Separator, Spacer } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, useQuery } from "relay-hooks"
import { ArtworkMeta } from "./ArtworkMeta"
import { AuctionResults } from "./AuctionResults"
import { ConsignCTA } from "./ConsignCTA"
import { Insights } from "./Insights"

/**
 * TODO: This will need to be a relay refetch container, because if the edit
 * button is pressed and changes are made in the modal, on complete the modal
 * slides down revealing the unedited view.
 *
 * On "edit > done" an event will need to be fired that calls `relay.refetch()`.
 * communicating back with this container that sits under the edit modal.
 */

export const MyCollectionArtworkDetail: React.FC<{ artworkID: string }> = ({ artworkID }) => {
  const navActions = AppStore.actions.myCollection.navigation

  const { props, error } = useQuery<MyCollectionArtworkDetailQuery>(
    graphql`
      query MyCollectionArtworkDetailQuery($artworkID: String!) {
        artwork(id: $artworkID) {
          id
          artistNames
          medium
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
    id: "4",
    artistNames: "Banksy",
    date: "1994",
    demand: "Strong demand",
    estimate: "$4,500 - $445,000",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/ng_LZVBhBb2805HMUIl6UQ/:version.jpg",
    },
    medium: "Pastels",
    title: "Turtle",
    hasInsights: true,
    hasAuctionResults: true,
    ...(props as any).artwork,
  }

  return (
    <ScrollView>
      <Join separator={<Spacer my={1} />}>
        <ScreenMargin>
          <Flex m={4} flexDirection="row" justifyContent="flex-end">
            {/* FIXME: Update with edit action */}
            <Button variant="noOutline" onPress={() => navActions.navigateToAddArtwork()}>
              Edit
            </Button>
          </Flex>
        </ScreenMargin>

        <OpaqueImageView
          // TODO: figure out if "normalized" is the correct version
          imageURL={artwork.image.url.replace(":version", "normalized")}
          height={200}
          // TODO: see https://github.com/artsy/eigen/blob/master/src/lib/Containers/WorksForYou.tsx#L92 for getting the actual screen width
          width={420}
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
