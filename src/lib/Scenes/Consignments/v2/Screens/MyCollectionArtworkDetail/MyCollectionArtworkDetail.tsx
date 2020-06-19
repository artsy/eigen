import { BorderBox, Box, Button, Flex, InfoCircleIcon, Join, Sans, Separator, Spacer } from "@artsy/palette"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import React from "react"
import { ScrollView, Text } from "react-native"
import { useStoreActions } from "../../State/hooks"

/**
 * TODO: This will need to be a relay refetch container, because if the edit
 * button is pressed and changes are made in the modal, on complete the modal
 * slides down revealing the unedited view.
 *
 * On "edit > done" an event will need to be fired that calls `relay.refetch()`.
 * communicating back with this container that sits under the edit modal.
 */

export const MyCollectionArtworkDetail = () => {
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

        <BorderBox height={200} bg="#ccc">
          <Text>Uploaded image placeholder</Text>
        </BorderBox>

        <ScreenMargin>
          <Field label="Artist" value="Cindy Sherman" />
          <Field label="Title" value="Untitled Film Still #3" />
          <Field label="Year created" value="1977" />
          <Field label="Medium" value="Photography" />
        </ScreenMargin>

        <BorderBox>
          <Flex flexDirection="row" justifyContent="space-between">
            <Box>
              <Sans size="4" weight="medium">
                Strong demand
              </Sans>
              <Sans size="4" color="black60">
                Est: $2,500 - $435,000
              </Sans>
            </Box>
            <Box>
              <Button size="large">Consign</Button>
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
              <Field label="Avg. Annual Value Sold" value="$5,346,000" />
              <Field label="Avg. Annual Lots Sold" value="25 - 50" />
              <Field label="Sell-through Rate" value="94.5%" />
              <Field label="Median Sale Price to Estimate" value="1.70x" />
              <Field label="Liquidity" value="Very high" />
              <Field label="1-Year Trend" value="Flat" />
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

            <Button variant="secondaryGray">Browse all auction works</Button>
          </Join>
        </ScreenMargin>

        <Separator />

        <ScreenMargin>
          <Join separator={<Spacer my={1} />}>
            <Sans size="6">Why sell with Artsy?</Sans>
            <WhySellStep />
            <WhySellStep />
            <WhySellStep />
          </Join>
        </ScreenMargin>

        <ScreenMargin>
          <Button size="large" block>
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

const WhySellStep: React.FC = () => {
  return (
    <Flex flexDirection="row">
      <Box mr={2}>
        <Sans size="3">1</Sans>
      </Box>
      <Box>
        <Sans size="3">Simple Steps</Sans>
        <Sans size="3" color="black60">
          Submit your work once, pick the best offer, and ship the work when it sells.{" "}
        </Sans>
      </Box>
    </Flex>
  )
}
