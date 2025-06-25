import { screen } from "@testing-library/react-native"
import { Footer } from "app/Scenes/CollectionsByCategory/Footer"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: {
      category: "Medium",
    },
  }),
}))

describe("Footer", () => {
  it("renders explore more categories text", () => {
    renderWithWrappers(<Footer />)

    expect(screen.getByText("Explore more categories")).toBeOnTheScreen()
  })

  it("renders other categories excluding current one", () => {
    renderWithWrappers(<Footer />)

    expect(screen.getByText("Movement")).toBeOnTheScreen()
    expect(screen.getByText("Size")).toBeOnTheScreen()
    expect(screen.getByText("Color")).toBeOnTheScreen()
    expect(screen.getByText("Price")).toBeOnTheScreen()
    expect(screen.getByText("Gallery")).toBeOnTheScreen()
    expect(screen.queryByText("Medium")).not.toBeOnTheScreen()
  })
})
