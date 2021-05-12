import { ActionType, OwnerType, Screen } from "@artsy/cohesion"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Button, View } from "react-native"
import { useTracking } from "react-tracking"
import {
  useScreenTracking,
  ProvideScreenTracking,
  ProvideScreenTrackingWithCohesionSchema,
  Schema,
  screenTrack,
  track,
} from ".."
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

  describe("in functional components", () => {
    const TestComponentHooksLegacy = () => {
      useScreenTracking(screenInfoLegacy)
      const { trackEvent } = useTracking()

      return (
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

    const TestComponentHooks = () => {
      useScreenTracking(screenInfo)
      const { trackEvent } = useTracking()

      return (
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

    it("works for tracking events with hooks (legacy info)", () => {
      expect(postEventToProviders).toHaveBeenCalledTimes(0)

      const component = renderWithWrappersTL(<TestComponentHooksLegacy />)

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenNthCalledWith(1, screenInfoLegacy)

      const button = component.getByType(Button)
      button.props.onPress()
      expect(postEventToProviders).toHaveBeenCalledTimes(2)
      // expect(postEventToProviders).toHaveBeenNthCalledWith(2, { aScreen: "a test screen", wow: "yes!" })
    })

    it("works for tracking events with hooks", () => {
      expect(postEventToProviders).toHaveBeenCalledTimes(0)

      const component = renderWithWrappersTL(<TestComponentHooks />)

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenNthCalledWith(1, screenInfo)

      const button = component.getByType(Button)
      button.props.onPress()
      expect(postEventToProviders).toHaveBeenCalledTimes(2)
      // expect(postEventToProviders).toHaveBeenNthCalledWith(2, { aScreen: "a test screen", wow: "yes!" })
    })

    const TestComponentHooksAndProviderLegacy = () => {
      const { trackEvent } = useTracking()

      return (
        <ProvideScreenTracking info={screenInfoLegacy}>
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

    const TestComponentHooksAndProvider = () => {
      const { trackEvent } = useTracking()

      return (
        <ProvideScreenTrackingWithCohesionSchema info={screenInfo}>
          <View>
            <Button
              title="track me"
              onPress={() => {
                trackEvent({ wow: "yes!" })
              }}
            />
          </View>
        </ProvideScreenTrackingWithCohesionSchema>
      )
    }

    it("works for tracking events with hooks and provider (legacy info)", () => {
      expect(postEventToProviders).toHaveBeenCalledTimes(0)

      const component = renderWithWrappersTL(<TestComponentHooksAndProviderLegacy />)

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenNthCalledWith(1, screenInfoLegacy)

      const button = component.getByType(Button)
      button.props.onPress()
      expect(postEventToProviders).toHaveBeenCalledTimes(2)
      // expect(postEventToProviders).toHaveBeenNthCalledWith(2, { aScreen: "a test screen", wow: "yes!" })
    })

    it("works for tracking events with hooks and provider", () => {
      expect(postEventToProviders).toHaveBeenCalledTimes(0)

      const component = renderWithWrappersTL(<TestComponentHooksAndProvider />)

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenNthCalledWith(1, screenInfo)

      const button = component.getByType(Button)
      button.props.onPress()
      expect(postEventToProviders).toHaveBeenCalledTimes(2)
      // expect(postEventToProviders).toHaveBeenNthCalledWith(2, { aScreen: "a test screen", wow: "yes!" })
    })
  })

  describe("in class components", () => {
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
      expect(postEventToProviders).toHaveBeenNthCalledWith(2, { aScreen: "a class screen", wow: "indeed!" })
    })
  })
})
