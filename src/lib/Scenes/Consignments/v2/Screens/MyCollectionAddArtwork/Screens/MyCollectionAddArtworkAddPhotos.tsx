import { Box, Button, Flex, Sans } from "@artsy/palette"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreState } from "lib/Scenes/Consignments/v2/State/hooks"
import React from "react"

export const MyCollectionAddArtworkAddPhotos = () => {
  const { navigator } = useStoreState(state => state.navigation)

  return (
    <Flex mt={4}>
      <Sans size="4" textAlign="center" weight="medium" style={{ position: "relative", top: -21 }}>
        Add photos
      </Sans>
      <ScreenMargin>
        <Box height={300}>
          <Sans size="3">Photo list</Sans>
        </Box>

        <Button block onPress={() => navigator?.pop()}>
          Done
        </Button>
      </ScreenMargin>
    </Flex>
  )
}
