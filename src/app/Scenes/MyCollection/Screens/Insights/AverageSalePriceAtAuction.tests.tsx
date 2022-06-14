import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { AverageSalePriceAtAuction } from "./AverageSalePriceAtAuction"

describe("AverageSalePriceAtAuction", () => {
  const mockArtist = {
    name: "Andy Warhol",
    formattedNationalityAndBirthday: "American, 1928–1987",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/E-k-uLoQADM8AjadsSKHrA/square.jpg",
    initials: "AW",
  }

  const TestRenderer = () => <AverageSalePriceAtAuction artistData={mockArtist} />

  it("renders title", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    expect(getByTestId("Average_Auction_Price_title")).toBeTruthy()
  })
})
