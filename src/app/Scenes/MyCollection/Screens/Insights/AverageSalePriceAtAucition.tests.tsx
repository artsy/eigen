import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { AverageSalePriceAtAucition } from "./AverageSalePriceAtAucition"

describe("AverageSalePriceAtAucition", () => {
  const TestRenderer = () => <AverageSalePriceAtAucition />

  it("renders title", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    expect(getByTestId("Average_Auction_Price_title")).toBeTruthy()
  })
})
