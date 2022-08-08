import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { InfoModal } from "./InfoModal"

describe("InfoModal", () => {
  it("renders the passed title", async () => {
    const { findByText } = renderWithWrappers(
      <InfoModal title="someTitle" visible onDismiss={jest.fn()} />
    )
    expect(await findByText("someTitle")).toBeTruthy()
  })
})
