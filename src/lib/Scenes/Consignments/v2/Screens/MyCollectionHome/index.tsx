import { Button, Sans } from "@artsy/palette"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React, { useRef } from "react"
import { View } from "react-native"

export const MyCollectionHome = () => {
  const navRef = useRef<View>(null)
  const { navigateToAddWork } = useStoreActions(actions => actions.navigation)

  return (
    <View ref={navRef}>
      <Sans size="3">My Collection Home</Sans>
      <Button block onPress={() => navigateToAddWork(navRef)}>
        Add a work
      </Button>
    </View>
  )
}
