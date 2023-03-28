import { fireEvent } from "@testing-library/react-native"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ActivityIndicator } from "./ActivityIndicator"

describe("ActivityIndicator", () => {
  it("should be displayed", () => {
    const { queryByLabelText } = renderWithWrappers(
      <ActivityIndicator hasUnseenNotifications={false} />
    )

    expect(queryByLabelText("Activity")).toBeDefined()
  })

  it("should track event when the bell icon is tapped", () => {
    const { getByLabelText } = renderWithWrappers(
      <ActivityIndicator hasUnseenNotifications={false} />
    )

    fireEvent.press(getByLabelText("Activity"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "clickedNotificationsBell",
        },
      ]
    `)
  })
})
