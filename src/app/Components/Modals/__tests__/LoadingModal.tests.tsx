import LoadingModal from "app/Components/Modals/LoadingModal"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("LoadingModal", () => {
  it("renders without throwing when invisible", async () => {
    await renderWithWrappers(<LoadingModal isVisible={false} />)
  })

  it("renders without throwing when visible", async () => {
    await renderWithWrappers(<LoadingModal isVisible={false} />)
  })
})
