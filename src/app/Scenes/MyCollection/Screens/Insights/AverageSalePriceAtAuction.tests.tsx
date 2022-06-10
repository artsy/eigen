import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { AverageSalePriceAtAuction } from "./AverageSalePriceAtAuction"

describe("AverageSalePriceAtAuction", () => {
  const TestRenderer = () => <AverageSalePriceAtAuction />

  it("renders title", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    expect(getByTestId("Average_Auction_Price_title")).toBeTruthy()
  })
})
