import { fireEvent, screen } from "@testing-library/react-native"
import { ArtsyGuarantee } from "app/Scenes/Artwork/Components/ArtsyGuarantee"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtsyGuarantee", () => {
  it("should render all sections correctly", () => {
    renderWithWrappers(<ArtsyGuarantee />)

    expect(screen.getByText("Secure Checkout")).toBeTruthy()
    expect(screen.getByLabelText("Secure Checkout Icon")).toBeTruthy()

    expect(screen.getByText("Money-Back Guarantee")).toBeTruthy()
    expect(screen.getByLabelText("Money-Back Guarantee Icon")).toBeTruthy()

    expect(screen.getByText("Authenticity Guarantee")).toBeTruthy()
    expect(screen.getByLabelText("Authenticity Guarantee Icon")).toBeTruthy()

    expect(screen.getByText("Learn more")).toBeTruthy()
  })

  it("should redirect to a webview with buyer-guarantee info", () => {
    renderWithWrappers(<ArtsyGuarantee />)

    expect(screen.getByText("Learn more")).toBeTruthy()

    fireEvent.press(screen.getByText("Learn more"))

    expect(navigate).toHaveBeenCalledWith("https://www.artsy.net/buyer-guarantee")
  })

  it("should trigger analytics event", () => {
    renderWithWrappers(<ArtsyGuarantee />)

    expect(screen.getByText("Learn more")).toBeTruthy()

    fireEvent.press(screen.getByText("Learn more"))

    expect(mockTrackEvent).toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedLearnMore",
      context_module: "artworkDetails",
      context_screen_owner_type: "artwork",
      subject: "Learn more",
      flow: "Artsy Guarantee",
    })
  })
})
