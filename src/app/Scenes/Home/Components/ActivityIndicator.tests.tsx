import { fireEvent } from "@testing-library/react-native"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ActivityIndicator } from "./ActivityIndicator"

describe("ActivityIndicator", () => {
  it("should be displayed", () => {
    const { queryByLabelText } = renderWithWrappers(<ActivityIndicator hasNotifications={false} />)

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
