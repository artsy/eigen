import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import WebView from "react-native-webview"
import { SaleFAQ } from "./SaleFAQ"

describe("SaleFAQ", () => {
  it("returns a webview", () => {
    const tree = renderWithWrappersLEGACY(<SaleFAQ />)

    expect(tree.root.findAllByType(WebView).length).toEqual(1)
  })
})
