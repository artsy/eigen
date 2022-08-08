import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import "react-native"
import LoadingModal from "./LoadingModal"

describe("LoadingModal", () => {
  it("renders without throwing when invisible", () => {
    renderWithWrappersLEGACY(<LoadingModal isVisible={false} />)
  })

  it("renders without throwing when visible", () => {
    renderWithWrappersLEGACY(<LoadingModal isVisible={false} />)
  })
})
