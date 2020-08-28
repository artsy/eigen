import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { Button, Join, Sans, Spacer } from "palette"
import React from "react"

// FIXME: Delete this eventually

export const MyCollectionHome = () => {
  const navActions = AppStore.actions.myCollection.navigation

  return (
    <ScreenMargin>
      <Sans size="3">My Collection Static Build</Sans>

      <Join separator={<Spacer my={1} />}>
        <Button block onPress={() => navActions.marketingHome()}>
          Marketing Home
        </Button>
        <Button block onPress={() => navActions.addArtwork()}>
          Add a work
        </Button>
        <Button block onPress={() => navActions.artworkDetail("1")}>
          Artwork Detail
        </Button>
        <Button block onPress={() => navActions.artworkList()}>
          Artwork List
        </Button>
      </Join>
    </ScreenMargin>
  )
}
