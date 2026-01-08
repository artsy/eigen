import { screen } from "@testing-library/react-native"
import { HTMLTest } from "app/Scenes/HTMLTest/HTMLTest"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("HTMLTest", () => {
  it("renders correctly", () => {
    renderWithWrappers(<HTMLTest />)

    expect(screen.getByText("HTML Test")).toBeOnTheScreen()
  })
})
