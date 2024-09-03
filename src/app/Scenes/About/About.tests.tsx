import { fireEvent, screen } from "@testing-library/react-native"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { About } from "./About"

describe("About", () => {
  it("renders Terms and Conditions", () => {
    renderWithWrappers(<About />)
    fireEvent.press(screen.getByText("Terms and Conditions"))
    expect(navigate).toHaveBeenCalledWith("/terms")
  })

  it("renders Privacy policy", () => {
    renderWithWrappers(<About />)
    fireEvent.press(screen.getByText("Privacy Policy"))
    expect(navigate).toHaveBeenCalledWith("/privacy")
  })

  it("renders Auction Supplement", () => {
    renderWithWrappers(<About />)
    fireEvent.press(screen.getByText("Auction Supplement"))
    expect(navigate).toHaveBeenCalledWith("/supplemental-cos")
  })

  it("renders Version", () => {
    renderWithWrappers(<About />)
    expect(screen.getByText("Version")).toBeDefined()
  })
})
