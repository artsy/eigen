import About from "lib/Components/Gene/About"
import { navigate } from "lib/navigation/navigate"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArticlesContainer } from "../Articles"

const query = {
  articlesConnection: {
    edges: [],
  },
}
describe("Articles", () => {
  it("renders Terms and conditions", () => {
    const tree = renderWithWrappers(<ArticlesContainer query={} />)

    expect(tree.root.findAllByProps({ title: "Terms of Use" })).toBeTruthy()
    tree.root.findByProps({ title: "Terms of Use" }).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/terms", { modal: true })
  })
})
