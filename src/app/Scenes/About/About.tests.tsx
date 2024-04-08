import { fireEvent, screen } from "@testing-library/react-native"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { About } from "./About"

describe("About", () => {
  it("renders Terms and conditions", () => {
    renderWithWrappers(<About />)
    fireEvent.press(screen.getByText("Terms of Use"))
    expect(navigate).toHaveBeenCalledWith("/terms")
  })

  it("renders Privacy policy", () => {
    renderWithWrappers(<About />)
    fireEvent.press(screen.getByText("Privacy Policy"))
    expect(navigate).toHaveBeenCalledWith("/privacy")
  })

  it("renders Conditions of Sale", () => {
    renderWithWrappers(<About />)
    fireEvent.press(screen.getByText("Conditions of Sale"))
    expect(navigate).toHaveBeenCalledWith("/conditions-of-sale")
  })

  it("renders Version", () => {
    renderWithWrappers(<About />)
    expect(screen.getByText("Version")).toBeDefined()
  })
})
