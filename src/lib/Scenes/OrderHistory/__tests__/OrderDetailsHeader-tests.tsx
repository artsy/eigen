import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { OrderDetailsHeader } from "../OrderDetails/OrderDetailsHeader"

describe("ArtworkTileRailCard", () => {
  const defaultProps = {
    fulfillment: "CommerceShip",
    code: "77777777",
    createdAt: "2021-05-28T09:37:09+03:00",
  }

  it("render OrderDetails props", () => {
    const fulfilmentT: "CommerceShip" | "CommercePickup" | "%other" | undefined = defaultProps.fulfillment as
      | "CommerceShip"
      | "CommercePickup"
      | "%other"
      | undefined
    const tree = renderWithWrappers(
      <OrderDetailsHeader code={defaultProps.code} createdAt={defaultProps.createdAt} fulfillment={fulfilmentT} />
    )
    const textFileds = tree.root.findAllByType(Text)
    expect(textFileds.length).toBe(6)
    expect(extractText(tree.root.findByProps({ "data-test-id": "date" }))).toBe("5/28/2021")
    expect(extractText(tree.root.findByProps({ "data-test-id": "code" }))).toBe("77777777")
    expect(extractText(tree.root.findByProps({ "data-test-id": "commerceShip" }))).toBe("Delivery")
  })
})
