import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { Button, View } from "react-native"
import { useTracking } from "react-tracking"
import { ProvideScreenTracking, screenTrack, track } from "."
import { postEventToProviders } from "./providers"

describe("Tracking", () => {
  beforeEach(() => {
    ;(postEventToProviders as jest.Mock).mockClear()
  })

  const TestComponentHooks = () => {
    const { trackEvent } = useTracking()
    return (
      <ProvideScreenTracking info={{ aScreen: "a test screen" } as any}>
        <View>
          <Button
            title="track me"
            onPress={() => {
              trackEvent({ wow: "yes!" })
            }}
          />
        </View>
      </ProvideScreenTracking>
    )
  }

  it.skip("works for tracking events with hooks", () => {
    expect(postEventToProviders).toHaveBeenCalledTimes(0)

    const component = renderWithWrappers(<TestComponentHooks />).root

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, { aScreen: "a test screen" })

    const button = component.findByType(Button)
    button.props.onPress()
    expect(postEventToProviders).toHaveBeenCalledTimes(2)
    expect(postEventToProviders).toHaveBeenNthCalledWith(2, {
      aScreen: "a test screen",
      wow: "yes!",
    })
  })

  @screenTrack({ aScreen: "a class screen" } as any)
  class TestComponentDecorators extends React.Component {
    @track({ wow: "indeed!" } as any)
    handlePress() {
      // doing some work
    }

    render() {
      return (
        <View>
          <Button title="track me" onPress={() => this.handlePress()} />
        </View>
      )
    }
  }

  it.skip("works for tracking events with decorators", () => {
    expect(postEventToProviders).toHaveBeenCalledTimes(0)

    const component = renderWithWrappers(<TestComponentDecorators />).root

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, { aScreen: "a class screen" })

    const button = component.findByType(Button)
    button.props.onPress()
    expect(postEventToProviders).toHaveBeenCalledTimes(2)
    expect(postEventToProviders).toHaveBeenNthCalledWith(2, {
      aScreen: "a class screen",
      wow: "indeed!",
    })
  })
})
