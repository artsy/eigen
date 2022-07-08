import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { SellWithArtsy } from "."

it("renders without throwing an error", () => {
  const props: any = { navigator: {}, route: {} }

  renderWithWrappers(<SellWithArtsy {...props} />)
})
