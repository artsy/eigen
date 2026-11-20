import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { postEventToProviders } from "app/utils/track/providers"
import React from "react"
import { Button, View } from "react-native"
import { useTracking } from "react-tracking"
import { ProvideScreenTracking, screenTrack, track } from ".."

// setupJest mocks react-tracking globally; this suite tests the real integration
jest.unmock("react-tracking")

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

  // Skipped: ProvideScreenTracking (deprecated) only fires a page view on mount and doesn't
  // provide tracking context, so hook events are not merged with the screen info.
  it.skip("works for tracking events with hooks", async () => {
    expect(postEventToProviders).toHaveBeenCalledTimes(0)

    renderWithWrappers(<TestComponentHooks />)

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, { aScreen: "a test screen" })

    fireEvent.press(screen.getByRole("button", { name: "track me" }))
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

  it("works for tracking events with decorators", async () => {
    expect(postEventToProviders).toHaveBeenCalledTimes(0)

    renderWithWrappers(<TestComponentDecorators />)

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, { aScreen: "a class screen" })

    fireEvent.press(screen.getByRole("button", { name: "track me" }))
    expect(postEventToProviders).toHaveBeenCalledTimes(2)
    expect(postEventToProviders).toHaveBeenNthCalledWith(2, {
      aScreen: "a class screen",
      wow: "indeed!",
    })
  })
})
