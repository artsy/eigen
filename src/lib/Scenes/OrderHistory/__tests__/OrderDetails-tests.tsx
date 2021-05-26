import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArtworkInfoSectionFragmentContainer } from "../OrderDetails/ArtworkInfoSection"
import { OrderDetailsPlaceholder, OrderDetailsQueryRender } from "../OrderDetails/OrderDetails"

jest.unmock("react-relay")

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))
describe(OrderDetailsQueryRender, () => {
  it("Loads OrderHistoryQueryRender with OrderDetailsPlaceholder", () => {
    const tree = renderWithWrappers(<OrderDetailsQueryRender orderID="21856921-fa90-4a36-a17e-dd52870952d2" />)
    expect(tree.root.findAllByType(OrderDetailsPlaceholder)).toHaveLength(1)
  })
  it("Loads OrderHistoryQueryRender with PageWithSimpleHeader", () => {
    const tree = renderWithWrappers(<OrderDetailsQueryRender orderID="21856921-fa90-4a36-a17e-dd52870952d2" />)
    expect(tree.root.findAllByType(PageWithSimpleHeader)).toHaveLength(1)
  })
})
