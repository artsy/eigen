import { fireEvent, screen } from "@testing-library/react-native"
import { About } from "app/Scenes/About/About"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("About", () => {
  it("renders Terms and Conditions", async () => {
    await renderWithWrappers(<About />)
    await fireEvent.press(screen.getByText("Terms and Conditions"))
    expect(navigate).toHaveBeenCalledWith("/terms")
  })

  it("renders Privacy Policy", async () => {
    await renderWithWrappers(<About />)
    await fireEvent.press(screen.getByText("Privacy Policy"))
    expect(navigate).toHaveBeenCalledWith("/privacy")
  })

  it("renders Auction Supplement", async () => {
    await renderWithWrappers(<About />)
    await fireEvent.press(screen.getByText("Auction Supplement"))
    expect(navigate).toHaveBeenCalledWith("/supplemental-cos")
  })

  it("renders Version", async () => {
    await renderWithWrappers(<About />)
    expect(screen.getByText("Version")).toBeDefined()
  })
})
