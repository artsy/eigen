import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ActivityIndicator } from "./ActivityIndicator"

describe("ActivityIndicator", () => {
  it("should not be displayed by default", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableActivity: false,
    })
    const { queryByLabelText } = renderWithWrappers(<ActivityIndicator hasNotifications={false} />)

    expect(queryByLabelText("Activity")).toBeNull()
  })

  describe("when feature flag is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableActivity: true,
      })
    })

    it("should be displayed", () => {
      const { queryByLabelText } = renderWithWrappers(
        <ActivityIndicator hasNotifications={false} />
      )

      expect(queryByLabelText("Activity")).toBeDefined()
    })

    it("should track event when the bell icon is tapped", () => {
      const { getByLabelText } = renderWithWrappers(<ActivityIndicator hasNotifications={false} />)

      fireEvent.press(getByLabelText("Activity"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "clickedNotificationsBell",
        },
      ]
    `)
    })
  })
})
