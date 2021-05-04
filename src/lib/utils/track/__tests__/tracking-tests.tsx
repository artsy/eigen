import React from "react"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { useTracking } from "react-tracking"
import { Button, View } from "react-native"
import { postEventToProviders } from "../providers"
import { ProvideScreenTracking, screenTrack } from ".."

describe("Tracking", () => {
  const TestComponentHooks = () => {
    const { trackEvent } = useTracking()
    return (
      // <ProvideScreenTracking info={{ aScreen: "a test screen" } as any}>
      <View>
        <Button
          title="track me"
          onPress={() => {
            trackEvent({ wow: "yes!" })
          }}
        />
      </View>
    )
  }


    expect(postEventToProviders).toHaveBeenCalledTimes(0)

    const button = tree.root.findByType(Button)
    button.props.onPress()
    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, { wow: "yes!" })
  })

})
