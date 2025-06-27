import { fireEvent, screen } from "@testing-library/react-native"
import { OrderDetailHelpLinks } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailHelpLinks"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("OrderDetailHelpLinks", () => {
  it("renders the help link section", () => {
    renderWithWrappers(<OrderDetailHelpLinks />)

    expect(screen.getByText("Visit our help center")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Visit our help center"))

    expect(navigate).toBeCalledWith("https://support.artsy.net/s/topic/0TO3b000000UessGAC/buy")
  })
})
