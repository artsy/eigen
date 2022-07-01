import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { MyAccountFieldEditScreen } from "./Components/MyAccountFieldEditScreen"
import { MyAccountEditPassword } from "./MyAccountEditPassword"

describe(MyAccountEditPassword, () => {
  it("has the right title", () => {
    const tree = renderWithWrappersLEGACY(<MyAccountEditPassword />)

    expect(tree.root.findByType(MyAccountFieldEditScreen).props.title).toEqual("Password")
  })
})
