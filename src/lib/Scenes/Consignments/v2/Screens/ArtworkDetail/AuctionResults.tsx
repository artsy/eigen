import { Box, Button, Flex, InfoCircleIcon, Join, Sans, Spacer } from "@artsy/palette"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React from "react"

export const AuctionResults: React.FC = () => {
  const navActions = useStoreActions(actions => actions.navigation)
  return (
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
