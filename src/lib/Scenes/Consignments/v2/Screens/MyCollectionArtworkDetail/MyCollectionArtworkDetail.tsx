import { Box, Button, Flex, Join, Sans, Separator, Spacer } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React from "react"
import { ScrollView } from "react-native"
import { ArtworkMeta, ArtworkMetaArtwork } from "./ArtworkMeta"
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

export const MyCollectionArtworkDetailContainer: React.FC<{ artworkID: string }> = ({ artworkID }) => {
  // Eventually this is happening via relay
  const artwork = getArtworkByID(artworkID)
  return <MyCollectionArtworkDetail artwork={artwork} />
}

export const MyCollectionArtworkDetail: React.FC<{ artwork: MyCollectionArtworkDetailArtwork }> = ({ artwork }) => {
  const navActions = useStoreActions(actions => actions.navigation)

  return (
    <ScrollView>
      <Join separator={<Spacer my={1} />}>
        <ScreenMargin>
          <Flex m={4} flexDirection="row" justifyContent="flex-end">
            {/* FIXME: Update with edit action */}
            <Button variant="noOutline" onPress={navActions.navigateToAddArtwork}>
              Edit
            </Button>
          </Flex>
        </ScreenMargin>

        <ArtworkImage artwork={artwork} />

        <ScreenMargin>
          <ArtworkMeta artwork={artwork} />
        </ScreenMargin>

        <ConsignCTA />

        <InsightWrapper artwork={artwork} />

        <AuctionResultsWrapper artwork={artwork} />

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
          <Button size="large" block onPress={navActions.navigateToConsign}>
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

const ArtworkImage: React.FC<{ artwork: MyCollectionArtworkDetailArtwork }> = ({ artwork }) => {
  if (!artwork.image?.url) {
    return null
  }

  return (
    <OpaqueImageView
      // TODO: figure out if "normalized" is the correct version
      imageURL={artwork.image.url.replace(":version", "normalized")}
      height={200}
      // TODO: see https://github.com/artsy/eigen/blob/master/src/lib/Containers/WorksForYou.tsx#L92 for getting the actual screen width
      width={420}
    />
  )
}

const InsightWrapper: React.FC<{ artwork: MyCollectionArtworkDetailArtwork }> = ({ artwork }) => {
  if (!artwork.hasInsights) {
    return null
  }

  return (
    <>
      <ScreenMargin>
        <Insights />
      </ScreenMargin>

      <Separator />
    </>
  )
}

const AuctionResultsWrapper: React.FC<{ artwork: MyCollectionArtworkDetailArtwork }> = ({ artwork }) => {
  if (!artwork.hasAuctionResults) {
    return null
  }

  return (
    <>
      <ScreenMargin>
        <AuctionResults />
      </ScreenMargin>

      <Separator />
    </>
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

// FIXME: Everything below here will be replaced when we're connected to real data

interface MyCollectionArtworkDetailArtwork extends ArtworkMetaArtwork {
  id: string
  artistNames: string
  date?: string
  demand: string
  estimate: string
  image?: {
    url: string
  }
  hasInsights: boolean
  hasAuctionResults: boolean
}

function getArtworkByID(artworkID: string): MyCollectionArtworkDetailArtwork {
  return data[artworkID]
}

const data: { [artworkId: string]: MyCollectionArtworkDetailArtwork } = {
  "1": {
    id: "1",
    artistNames: "Andy Goldsworthy",
    date: "1991",
    demand: "Strong demand",
    estimate: "$1,500 - $115,000",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/XfpWAbjogvTja0baxOk2eg/square.jpg",
    },
    medium: "Photography",
    title: "Mint Avalanche",
    hasInsights: false,
    hasAuctionResults: false,
  },
  "2": {
    id: "2",
    artistNames: "Andy Warhol",
    date: "1992",
    demand: "Strong demand",
    estimate: "$2,500 - $225,000",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/DkpNiCKRYoqa7BXEtsZSpQ/square.jpg",
    },
    medium: "Dry Erase markers",
    title: "Butter Pecan",
    hasInsights: true,
    hasAuctionResults: false,
  },
  "3": {
    id: "3",
    artistNames: "James Rosenquist",
    date: "1993",
    demand: "Strong demand",
    estimate: "$3,500 - $335,000",
    medium: "Cat hair",
    title: "Rocky Road",
    hasInsights: false,
    hasAuctionResults: true,
  },
  "4": {
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
  },
}
