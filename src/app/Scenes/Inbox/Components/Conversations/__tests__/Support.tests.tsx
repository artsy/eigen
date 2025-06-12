import { screen } from "@testing-library/react-native"
import { Support } from "app/Scenes/Inbox/Components/Conversations/Support"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Support", () => {
  it("render", () => {
    renderWithWrappers(<Support />)

    expect(screen.getByText("Support")).toBeOnTheScreen()
    expect(screen.getByText("Inquiries FAQ")).toBeOnTheScreen()
  })
})
