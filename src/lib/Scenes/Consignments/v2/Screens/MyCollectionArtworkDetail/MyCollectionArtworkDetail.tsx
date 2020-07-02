import { BorderBox, Box, Button, Flex, InfoCircleIcon, Join, Sans, Separator, Spacer } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React from "react"
import { ScrollView, Text } from "react-native"

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

interface MyCollectionArtworkDetailArtwork {
  id: string
  artistNames: string
  date: string
  demand: string
  estimate: string
  image: {
    url: string
  }
  medium: string
  title: string
  insights: {
    averageAnnualValueSold: string
    averageAnnualLotsSold: string
    sellThroughRate: string
    medianSalePriceToEstimate: string
    liquidity: string
    oneYearTrend: string
  }
}

function getArtworkByID(artworkID: string): MyCollectionArtworkDetailArtwork {
  return {
    id: artworkID,
    artistNames: "Andy Warhol",
    date: "1992",
    demand: "Strong demand",
    estimate: "$2,500 - $435,000",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/DkpNiCKRYoqa7BXEtsZSpQ/:version.jpg",
    },
    medium: "Dry Erase markers",
    title: "Stone Temple Pilots, they're elegant bachelors",
    insights: {
      averageAnnualValueSold: "$5,346,000",
      averageAnnualLotsSold: "25 - 50",
      sellThroughRate: "94.5%",
      medianSalePriceToEstimate: "1.70x",
      liquidity: "Very high",
      oneYearTrend: "Flat",
    },
  }
}

// TODO:
//   * Finish making data "dynamic"
//   * render sections as a FlatList
//   * Deal with optional fields

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

        <OpaqueImageView
          // TODO: figure out if "normalized" is the correct version
          imageURL={artwork.image.url.replace(":version", "normalized")}
          height={200}
          // TODO: see https://github.com/artsy/eigen/blob/master/src/lib/Containers/WorksForYou.tsx#L92 for getting the actual screen width
          width={420}
        />

        <ScreenMargin>
          <Field label="Artist" value={artwork.artistNames} />
          <Field label="Title" value={artwork.title} />
          <Field label="Year created" value={artwork.date} />
          <Field label="Medium" value={artwork.medium} />
        </ScreenMargin>

        <BorderBox>
          <Flex flexDirection="row" justifyContent="space-between">
            <Box>
              <Sans size="4" weight="medium">
                {artwork.demand}
              </Sans>
              <Sans size="4" color="black60">
                Est: {artwork.estimate}
              </Sans>
            </Box>
            <Box>
              <Button size="large" onPress={navActions.navigateToConsign}>
                Consign
              </Button>
            </Box>
          </Flex>
        </BorderBox>

        <ScreenMargin>
          <Join separator={<Spacer my={1} />}>
            <BorderBox height={100} bg="#ccc">
              <Text>Price / Demand graphs / charts</Text>
            </BorderBox>

            <BorderBox>
              <Sans size="3">Very Strong Demand</Sans>
              <Sans size="3" color="black60">
                Demand is much higher than the supply available in the market and sale price exceeds estimates.
              </Sans>
            </BorderBox>

            <Box>
              <Field label="Avg. Annual Value Sold" value={artwork.insights.averageAnnualValueSold} />
              <Field label="Avg. Annual Lots Sold" value={artwork.insights.averageAnnualLotsSold} />
              <Field label="Sell-through Rate" value={artwork.insights.sellThroughRate} />
              <Field label="Median Sale Price to Estimate" value={artwork.insights.medianSalePriceToEstimate} />
              <Field label="Liquidity" value={artwork.insights.liquidity} />
              <Field label="1-Year Trend" value={artwork.insights.oneYearTrend} />
            </Box>
          </Join>
        </ScreenMargin>

        <Separator />

        <ScreenMargin>
          <Join separator={<Spacer my={1} />}>
            <Flex flexDirection="row">
              <Sans size="4" weight="medium">
                Auction Results
              </Sans>
              <Box ml={1} position="relative" top="4px">
                <InfoCircleIcon />
              </Box>
            </Flex>

            <AuctionWork />
            <AuctionWork />

            <Button variant="secondaryGray" onPress={navActions.navigateToArtist}>
              Browse all auction works
            </Button>
          </Join>
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

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <Flex flexDirection="row" justifyContent="space-between" my={0.5}>
      <Sans size="4" color="black60">
        {label}
      </Sans>
      <Sans size="4">{value}</Sans>
    </Flex>
  )
}

const AuctionWork: React.FC = () => {
  return (
    <Box>
      <Sans size="3">Last work sold</Sans>
      <Flex flexDirection="row" justifyContent="space-between">
        <Box>
          <Flex flexDirection="row">
            <Box width={45} height={45} bg="black30" mr={1} />
            <Box>
              <Sans size="3" color="black60">
                The Ground, 1953
              </Sans>
              <Sans size="3" color="black60">
                Sold Nov 24, 2019
              </Sans>
            </Box>
          </Flex>
        </Box>
        <Box>
          <Sans size="3">€87,500</Sans>
        </Box>
      </Flex>
    </Box>
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
