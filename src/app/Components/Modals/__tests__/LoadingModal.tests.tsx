import LoadingModal from "app/Components/Modals/LoadingModal"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("LoadingModal", () => {
  it("renders without throwing when invisible", () => {
    renderWithWrappers(<LoadingModal isVisible={false} />)
  })

  it("renders without throwing when visible", () => {
    renderWithWrappers(<LoadingModal isVisible={false} />)
  })
})
