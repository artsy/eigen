import { fireEvent, screen } from "@testing-library/react-native"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ArtsyGuarantee } from "./ArtsyGuarantee"

describe("ArtsyGuarantee", () => {
  it("should render all sections correctly", () => {
    renderWithWrappers(<ArtsyGuarantee />)

    expect(screen.queryByText("Secure Checkout")).toBeTruthy()
    expect(screen.getByLabelText("Secure Checkout Icon")).toBeTruthy()

    expect(screen.queryByText("Money-Back Guarantee")).toBeTruthy()
    expect(screen.getByLabelText("Money-Back Guarantee Icon")).toBeTruthy()

    expect(screen.queryByText("Authenticity Guarantee")).toBeTruthy()
    expect(screen.getByLabelText("Authenticity Guarantee Icon")).toBeTruthy()

    expect(screen.queryByText("Learn more")).toBeTruthy()
  })

  it("should redirect to a webview with buyer-guarantee info", () => {
    renderWithWrappers(<ArtsyGuarantee />)

    expect(screen.queryByText("Learn more")).toBeTruthy()

    fireEvent.press(screen.getByText("Learn more"))

    expect(navigate).toHaveBeenCalledWith("https://www.artsy.net/buyer-guarantee")
  })
})
