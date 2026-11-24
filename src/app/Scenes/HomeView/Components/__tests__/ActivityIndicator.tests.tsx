import { fireEvent, screen } from "@testing-library/react-native"
import { ActivityIndicator } from "app/Scenes/HomeView/Components/ActivityIndicator"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ActivityIndicator", () => {
  it("should be displayed", async () => {
    await renderWithWrappers(<ActivityIndicator hasUnseenNotifications={false} />)

    expect(screen.getByLabelText("Activity")).toBeDefined()
  })

  it("should track event when the bell icon is tapped", async () => {
    await renderWithWrappers(<ActivityIndicator hasUnseenNotifications={false} />)

    await fireEvent.press(screen.getByLabelText("Activity"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedNotificationsBell",
        },
      ]
    `)
  })
})
