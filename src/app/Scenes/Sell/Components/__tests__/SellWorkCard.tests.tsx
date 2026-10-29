import { screen } from "@testing-library/react-native"
import { SellWorkCardTestsQuery } from "__generated__/SellWorkCardTestsQuery.graphql"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SellWorkCard", () => {
  const { renderWithRelay } = setupTestWrapper<SellWorkCardTestsQuery>({
    Component: ({ artwork }) => <SellWorkCard artwork={artwork!} />,
    query: graphql`
      query SellWorkCardTestsQuery @relay_test_operation {
        artwork(id: "the-artwork") {
          ...SellWorkCard_artwork
        }
      }
    `,
  })

  it("shows the work with its auction channel", () => {
    // getSellChannel treats an odd second-last hex digit as an auction
    renderWithRelay({
      Artwork: () => ({
        internalID: "id-b4",
        artistNames: "Amoako Boafo",
        title: "Clasped Hands",
        date: "2026",
      }),
    })

    expect(screen.getByText("Amoako Boafo")).toBeOnTheScreen()
    expect(screen.getByText("Clasped Hands, 2026")).toBeOnTheScreen()
    expect(screen.getByText("To be reviewed by a specialist")).toBeOnTheScreen()
    expect(screen.getByText("Artnet Auction")).toBeOnTheScreen()
  })

  it("shows the estimate for a listing work", () => {
    renderWithRelay({ Artwork: () => ({ internalID: "id-a2" }) })

    expect(screen.getByText("Estimated Value: US$2,800–3,600")).toBeOnTheScreen()
    expect(screen.getByText("Artsy Listing")).toBeOnTheScreen()
  })

  it("leaves out the date when the work has none", () => {
    renderWithRelay({ Artwork: () => ({ internalID: "id-a2", title: "Untitled", date: null }) })

    expect(screen.getByText("Untitled")).toBeOnTheScreen()
  })
})
