import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { MyAccountEditPassword } from "./MyAccountEditPassword"

describe(MyAccountEditPassword, () => {
  jest.clearAllMocks()

  it("has the right titles", () => {
    renderWithWrappers(<MyAccountEditPassword />)

    expect(screen.getByText("Current password")).toBeTruthy()
    expect(screen.getByText("New password")).toBeTruthy()
  })
})
