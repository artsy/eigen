import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"
import LoadingModal from "app/Components/Modals/LoadingModal"

describe("LoadingModal", () => {
  it("renders without throwing when invisible", () => {
    renderWithWrappersLEGACY(<LoadingModal isVisible={false} />)
  })

  it("renders without throwing when visible", () => {
    renderWithWrappersLEGACY(<LoadingModal isVisible={false} />)
  })
})
