import { Button, Join, Sans, Spacer } from "@artsy/palette"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React, { useEffect, useRef } from "react"
import { View } from "react-native"

export const MyCollectionHome = () => {
  const navRef = useRef<View>(null)
  const navActions = useStoreActions(actions => actions.navigation)

  useEffect(() => {
    navActions.setupNavigation(navRef)
  }, [])

  return (
    <View ref={navRef}>
      <Sans size="3">My Collection Static Build</Sans>

      <Join separator={<Spacer my={2} />}>
        <Button block onPress={() => navActions.navigateToAddArtwork()}>
          Add a work
        </Button>
        <Button block onPress={() => navActions.navigateToArtworkDetail()}>
          Artwork Detail
        </Button>
        <Button block onPress={() => navActions.navigateToArtworkList()}>
          Artwork List
        </Button>
      </Join>
    </View>
  )
}
