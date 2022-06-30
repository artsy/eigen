import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { SellWithArtsy } from "."

jest.unmock("react-relay")

it("renders without throwing an error", () => {
  const props: any = { navigator: {}, route: {} }

  renderWithWrappersTL(<SellWithArtsy {...props} />)
})
