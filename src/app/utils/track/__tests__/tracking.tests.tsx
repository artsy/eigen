import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { postEventToProviders } from "app/utils/track/providers"
import React from "react"
import { Button, View } from "react-native"
import { screenTrack, track } from ".."

// setupJest mocks react-tracking globally; this suite tests the real integration
jest.unmock("react-tracking")

describe("Tracking", () => {
  beforeEach(() => {
    ;(postEventToProviders as jest.Mock).mockClear()
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
