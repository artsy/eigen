import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { SellWithArtsy } from "."

jest.mock("../../../../../utils/useStatusBarStyle", () => {
  return {
    useLightStatusBarStyle: jest.fn(),
  }
})

it("renders without throwing an error", () => {
  const props: any = { navigator: {}, route: {} }

  renderWithWrappers(<SellWithArtsy {...props} />)
})
