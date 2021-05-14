import { ActionType, OwnerType, Screen } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Button, View } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { trackingTestsQuery } from "__generated__/trackingTestsQuery.graphql"
import { Schema, screenTrack, track, useTracking } from ".."
import { postEventToProviders } from "../providers"

describe("Tracking", () => {
  const screenInfoLegacy: Schema.PageView = {
    context_screen: Schema.PageNames.AboutTheFairPage,
    context_screen_owner_type: null,
  }
  const screenInfo: Screen = {
    action: ActionType.screen,
    context_screen_owner_type: OwnerType.artistAuctionResults,
  }
  const buttonInfo = { wow: "yes!" }

  describe("in functional components", () => {
    const createTestComponentHooks = (info: Parameters<typeof useTracking>[0]) => {
      const TestComponent = () => {
        const { trackEvent } = useTracking(info)

        return (
          <View>
            <Button title="track me" onPress={() => trackEvent(buttonInfo)} />
          </View>
        )
      }
      return TestComponent
    }
    const TestComponentHooksLegacy = createTestComponentHooks(screenInfoLegacy)
    const TestComponentHooks = createTestComponentHooks(screenInfo)

    it("works for tracking events with hooks (legacy info)", () => {
      expect(postEventToProviders).toHaveBeenCalledTimes(0)

      const component = renderWithWrappersTL(<TestComponentHooksLegacy />)

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenNthCalledWith(1, screenInfoLegacy)

      const button = component.getByType(Button)
      fireEvent.press(button)
      expect(postEventToProviders).toHaveBeenCalledTimes(2)
      expect(postEventToProviders).toHaveBeenNthCalledWith(2, { ...screenInfoLegacy, ...buttonInfo })
    })

    it("works for tracking events with hooks", () => {
      expect(postEventToProviders).toHaveBeenCalledTimes(0)

      const component = renderWithWrappersTL(<TestComponentHooks />)

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenNthCalledWith(1, screenInfo)

      const button = component.getByType(Button)
      fireEvent.press(button)
      expect(postEventToProviders).toHaveBeenCalledTimes(2)
      expect(postEventToProviders).toHaveBeenNthCalledWith(2, { ...screenInfo, ...buttonInfo })
    })
  })

  describe("in class components", () => {
    @screenTrack(screenInfoLegacy)
    class TestComponentDecoratorsLegacy extends React.Component {
      @track(buttonInfo as any)
      handlePress() {
        // do some work
      }

      render() {
        return (
          <View>
            <Button title="track me" onPress={() => this.handlePress()} />
          </View>
        )
      }
    }

    @screenTrack(screenInfo)
    class TestComponentDecorators extends React.Component {
      @track(buttonInfo as any)
      handlePress() {
        // do some work
      }

      render() {
        return (
          <View>
            <Button title="track me" onPress={() => this.handlePress()} />
          </View>
        )
      }
    }

    it("works for tracking events with decorators (legacy info)", () => {
      expect(postEventToProviders).toHaveBeenCalledTimes(0)

      const component = renderWithWrappersTL(<TestComponentDecoratorsLegacy />)

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenNthCalledWith(1, screenInfoLegacy)

      const button = component.getByType(Button)
      fireEvent.press(button)
      expect(postEventToProviders).toHaveBeenCalledTimes(2)
      expect(postEventToProviders).toHaveBeenNthCalledWith(2, { ...screenInfoLegacy, ...buttonInfo })
    })

    it("works for tracking events with decorators", () => {
      expect(postEventToProviders).toHaveBeenCalledTimes(0)

      const component = renderWithWrappersTL(<TestComponentDecorators />)

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenNthCalledWith(1, screenInfo)

      const button = component.getByType(Button)
      fireEvent.press(button)
      expect(postEventToProviders).toHaveBeenCalledTimes(2)
      expect(postEventToProviders).toHaveBeenNthCalledWith(2, { ...screenInfo, ...buttonInfo })
    })
  })

  describe("in QueryRenderers", () => {
    const TestComponent = () => {
      const { trackEvent } = useTracking(screenInfo)

      return (
        <View>
          <Button title="track me" onPress={() => trackEvent(buttonInfo)} />
        </View>
      )
    }

    const mockEnvironment = createMockEnvironment()

    const TestComponentQueryRenderer = () => (
      <QueryRenderer<trackingTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query trackingTestsQuery @relay_test_operation {
            me {
              name
            }
          }
        `}
        variables={{}}
        render={() => <TestComponent />}
      />
    )

    it("works", () => {
      const component = renderWithWrappersTL(<TestComponentQueryRenderer />)
      mockEnvironmentPayload(mockEnvironment)
    })
  })
})
