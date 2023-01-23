import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { About } from "./About"

describe("About", () => {
  it("renders Terms and conditions", () => {
    const tree = renderWithWrappersLEGACY(<About />)

    expect(tree.root.findAllByProps({ title: "Terms of Use" })).toBeTruthy()
    tree.root.findByProps({ title: "Terms of Use" }).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/terms", { modal: true })
  })

  it("renders Privacy policy", () => {
    const tree = renderWithWrappersLEGACY(<About />)

    expect(tree.root.findAllByProps({ title: "Privacy Policy" })).toBeTruthy()
    tree.root.findByProps({ title: "Privacy Policy" }).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/privacy", { modal: true })
  })

  it("renders Conditions of Sale", () => {
    const tree = renderWithWrappersLEGACY(<About />)

    expect(tree.root.findAllByProps({ title: "Conditions of Sale" })).toBeTruthy()
    tree.root.findByProps({ title: "Conditions of Sale" }).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/conditions-of-sale", { modal: true })
  })

  it("renders Version", () => {
    const tree = renderWithWrappersLEGACY(<About />)

    expect(tree.root.findAllByProps({ title: "Version" })).toBeTruthy()
  })
})
