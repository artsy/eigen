import { ErrorView } from "app/Components/ErrorView/ErrorView"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ErrorView", () => {
  it("renders a default message", async () => {
    const { findByText } = renderWithWrappers(<ErrorView />)
    expect(
      await findByText(
        "There seems to be a problem with submission creation. Please try again shortly."
      )
    ).toBeTruthy()
  })

  it("renders a default message", async () => {
    const { findByText } = renderWithWrappers(<ErrorView message="something errory" />)
    expect(await findByText("something errory")).toBeTruthy()
  })
})
