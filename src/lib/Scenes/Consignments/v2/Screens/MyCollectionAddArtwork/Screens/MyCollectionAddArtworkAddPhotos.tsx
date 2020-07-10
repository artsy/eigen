import { Box, Button, Flex, Sans } from "@artsy/palette"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React from "react"

export const MyCollectionAddArtworkAddPhotos = () => {
  const { goBack } = useStoreActions(actions => actions.navigation)

  return (
    <Flex mt={4}>
      <Sans size="4" textAlign="center" weight="medium" style={{ position: "relative", top: -21 }}>
        Add photos
      </Sans>
      <ScreenMargin>
        <Box height={300}>
          <Sans size="3">Photo list</Sans>
        </Box>

        <Button block onPress={goBack}>
          Done
        </Button>
      </ScreenMargin>
    </Flex>
  )
}
