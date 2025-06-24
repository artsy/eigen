import { fireEvent, screen } from "@testing-library/react-native"
import { Footer } from "app/Scenes/CollectionsByCategory/Footer"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: {
      category: "Medium",
      entityID: "Medium",
    },
  }),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

describe("Footer", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders other categories excluding current one", () => {
    renderWithWrappers(<Footer />)

    // Should show other categories but not "Medium" (current category)
    expect(screen.getByText(/Movement/)).toBeOnTheScreen()
    expect(screen.getByText(/Price/)).toBeOnTheScreen()
    expect(screen.getByText(/Size/)).toBeOnTheScreen()
    expect(screen.getByText(/Color/)).toBeOnTheScreen()
    expect(screen.getByText(/Gallery/)).toBeOnTheScreen()
    expect(screen.queryByText(/Medium/)).not.toBeOnTheScreen()
  })

  it("navigates to another category", () => {
    renderWithWrappers(<Footer />)

    fireEvent.press(screen.getByText(/Movement/))
    expect(navigate).toHaveBeenCalledWith("/collections-by-category/Movement", {
      passProps: { category: "Movement", entityID: "Movement" },
    })
  })
})
