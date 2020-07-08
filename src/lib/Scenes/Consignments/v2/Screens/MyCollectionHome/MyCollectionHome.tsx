import { Button, Join, Sans, Spacer } from "@artsy/palette"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React from "react"

export const MyCollectionHome = () => {
  const navActions = useStoreActions(actions => actions.navigation)

  return (
    <ScreenMargin>
      <Sans size="3">My Collection Static Build</Sans>

      <Join separator={<Spacer my={1} />}>
        <Button block onPress={() => navActions.navigateToMarketingHome()}>
          Marketing Home
        </Button>
        <Button block onPress={() => navActions.navigateToAddArtwork()}>
          Add a work
        </Button>
        <Button block onPress={() => navActions.navigateToArtworkDetail("1")}>
          Artwork Detail
        </Button>
        <Button block onPress={() => navActions.navigateToArtworkList()}>
          Artwork List
        </Button>
      </Join>
    </ScreenMargin>
  )
}
