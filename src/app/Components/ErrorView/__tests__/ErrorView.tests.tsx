import { screen } from "@testing-library/react-native"
import { ErrorView } from "app/Components/ErrorView/ErrorView"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ErrorView", () => {
  it("renders a default message", async () => {
    await renderWithWrappers(<ErrorView />)
    expect(
      await screen.findByText(
        "There seems to be a problem with submission creation. Please try again shortly."
      )
    ).toBeTruthy()
  })

  it("renders a default message", async () => {
    await renderWithWrappers(<ErrorView message="something errory" />)
    expect(await screen.findByText("something errory")).toBeTruthy()
  })
})
