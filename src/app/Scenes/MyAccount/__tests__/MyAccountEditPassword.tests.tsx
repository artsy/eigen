import { screen } from "@testing-library/react-native"
import { MyAccountEditPassword } from "app/Scenes/MyAccount/MyAccountEditPassword"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe(MyAccountEditPassword, () => {
  jest.clearAllMocks()

  it("has the right titles", () => {
    renderWithWrappers(<MyAccountEditPassword />)

    expect(screen.getByText("Current password")).toBeTruthy()
    expect(screen.getAllByText("New password")).toBeTruthy()
  })
})
