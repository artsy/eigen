import { Box, Button, Flex, Sans } from "@artsy/palette"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React from "react"

export const MyCollectionAddArtworkAddPhotos = () => {
  const navActions = useStoreActions(actions => actions.navigation)

  return (
    <>
      <FancyModalHeader onBackNavigation={() => navActions.goBack()}>Add photos</FancyModalHeader>
      <Flex mt={4}>
        <ScreenMargin>
          <Box height={300}>
            <Sans size="3">Photo list</Sans>
          </Box>

          <Button block onPress={navActions.goBack}>
            Done
          </Button>
        </ScreenMargin>
      </Flex>
    </>
  )
}
