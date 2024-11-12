import { screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { MyAccountEditPassword } from "./MyAccountEditPassword"

describe(MyAccountEditPassword, () => {
  jest.clearAllMocks()
  __globalStoreTestUtils__?.injectFeatureFlags({
    AREnableNewNavigation: true,
  })

  it("has the right titles", () => {
    renderWithWrappers(<MyAccountEditPassword />)

    expect(screen.getByText("Current password")).toBeTruthy()
    expect(screen.getByText("New password")).toBeTruthy()
  })
})
