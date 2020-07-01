import { Box, Button, Flex, Join, Sans, Separator, Spacer } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import { Input } from "lib/Scenes/Search/Input"
import React from "react"

export const MyCollectionAddArtwork = () => {
  const navActions = useStoreActions(actions => actions.navigation)

  return (
    <Box>
      <Flex mt={4}>
        <Sans size="4" textAlign="center" weight="medium" style={{ position: "relative", top: -21 }}>
          Add artwork
        </Sans>
      </Flex>

      <Separator mt={0} mb={2} />

      <Sans size="4" textAlign="center">
        Add details about your work for a price {"\n"}
        evaluation and market insights.
      </Sans>

      <ScreenMargin>
        <Join separator={<Spacer my={1} />}>
          <Input
            title="Artist"
            style={{ height: 50 }}
            placeholder="Search artists"
            icon={<SearchIcon width={18} height={18} />}
          />
          <Input title="Medium" style={{ height: 50 }} placeholder="Select" />
          <Input title="Size" style={{ height: 50 }} placeholder="Select" />
        </Join>
      </ScreenMargin>

      <Spacer my={1} />

      <Button variant="noOutline" onPress={() => navActions.navigateToAddArtworkPhotos()}>
        Photos (optional)
      </Button>
      <Button variant="noOutline" onPress={() => navActions.navigateToAddTitleAndYear()}>
        Title & year (optional)
      </Button>
    </Box>
  )
}
