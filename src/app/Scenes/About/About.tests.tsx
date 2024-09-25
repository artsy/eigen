import { fireEvent, screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { About } from "./About"

describe("About", () => {
  beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewTermsAndConditions: false })
    })

  it("renders Terms of Use", () => {
    renderWithWrappers(<About />)
    fireEvent.press(screen.getByText("Terms of Use"))
    expect(navigate).toHaveBeenCalledWith("/terms")
  })

  it("renders Privacy Policy", () => {
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

  describe("when the new disclaimer is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewTermsAndConditions: true })
    })

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
})
