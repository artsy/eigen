import { fireEvent, screen } from "@testing-library/react-native"
import { OrderDetailBuyerProtection } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailBuyerProtection"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("OrderDetailBuyerProtection", () => {
  it("renders the Artsy buyer protection section", () => {
    renderWithWrappers(<OrderDetailBuyerProtection />)

    expect(screen.getByText("Artsy’s buyer protection")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Artsy’s buyer protection"))

    expect(navigate).toBeCalledWith("https://support.artsy.net/s/article/The-Artsy-Guarantee")
  })
})
