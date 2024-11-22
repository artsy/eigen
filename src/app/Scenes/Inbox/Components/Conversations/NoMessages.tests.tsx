import { fireEvent, screen } from "@testing-library/react-native"
import { NoMessages } from "app/Scenes/Inbox/Components/Conversations/NoMessages"
import { switchTab } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("NoMessages", () => {
  it("Navigates to home when clicked", () => {
    renderWithWrappers(<NoMessages />)

    fireEvent.press(screen.getByText("Explore Works"))

    expect(switchTab).toHaveBeenCalledWith("home")
  })
})
