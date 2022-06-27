import { renderWithWrappers } from "app/tests/renderWithWrappers"
import "react-native"
import LoadingModal from "./LoadingModal"

describe("LoadingModal", () => {
  it("renders without throwing when invisible", () => {
    renderWithWrappers(<LoadingModal isVisible={false} />)
  })

  it("renders without throwing when visible", () => {
    renderWithWrappers(<LoadingModal isVisible={false} />)
  })
})
