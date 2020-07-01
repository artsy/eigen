import { Button, Flex, Join, Sans, Spacer } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreState } from "lib/Scenes/Consignments/v2/State/hooks"
import { Input } from "lib/Scenes/Search/Input"
import React from "react"

export const MyCollectionAddArtworkTitleAndYear = () => {
  const { navigator } = useStoreState(state => state.navigation)

  return (
    <Flex mt={4}>
      <Sans size="4" textAlign="center" weight="medium" style={{ position: "relative", top: -21 }}>
        Add title & year
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

        <Spacer my={1} />

        <Button block onPress={() => navigator?.pop()}>
          Done
        </Button>
      </ScreenMargin>
    </Flex>
  )
}
