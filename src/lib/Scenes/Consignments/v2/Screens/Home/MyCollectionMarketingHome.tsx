import { Box, Button, Flex, Join, Sans, Separator, Spacer } from "@artsy/palette"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import React from "react"

export const MyCollectionMarketingHome = () => {
  const navActions = AppStore.actions.consignments.navigation

  return (
    <Box>
      <ScreenMargin>
        <Flex alignItems="center" mt={4}>
          <Join separator={<Spacer my={1} />}>
            <Sans size="8" textAlign="center">
              Evaluate Your Art{"\n"} Collection
            </Sans>
            <Sans size="4" textAlign="center">
              Track the market for artworks you own.{"\n"}
              When the time is right, consign with Artsy.
            </Sans>
            <Button block onPress={() => navActions.navigateToAddArtwork()}>
              Add a work
            </Button>
          </Join>
        </Flex>
      </ScreenMargin>

      <Separator my={2} />
    </Box>
  )
}
