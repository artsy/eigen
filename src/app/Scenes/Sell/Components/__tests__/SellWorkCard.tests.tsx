import { screen } from "@testing-library/react-native"
import { SellWorkCardTestsQuery } from "__generated__/SellWorkCardTestsQuery.graphql"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { ResaleSubmissionWithChannel } from "app/Scenes/Sell/utils/resaleSubmission"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const resaleSubmission = (
  overrides: Partial<ResaleSubmissionWithChannel>
): ResaleSubmissionWithChannel => ({
  internalID: "resaleSubmission-1",
  state: "ACCEPTED",
  channel: "MARKETPLACE",
  estimate: null,
  statusMessage: "In progress",
  ...overrides,
})

describe("SellWorkCard", () => {
  let cardResaleSubmission: ResaleSubmissionWithChannel

  const { renderWithRelay } = setupTestWrapper<SellWorkCardTestsQuery>({
    Component: ({ artwork }) => (
      <SellWorkCard artwork={artwork!} resaleSubmission={cardResaleSubmission} />
    ),
    query: graphql`
      query SellWorkCardTestsQuery @relay_test_operation {
        artwork(id: "the-artwork") {
          ...SellWorkCard_artwork
        }
      }
    `,
  })

  it("shows the work with its auction channel", () => {
    cardResaleSubmission = resaleSubmission({ channel: "AUCTION" })
    renderWithRelay({
      Artwork: () => ({
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
    cardResaleSubmission = resaleSubmission({ estimate: "US$2,800–US$3,600" })
    renderWithRelay()

    expect(screen.getByText("Estimated Value: US$2,800–US$3,600")).toBeOnTheScreen()
    expect(screen.getByText("Artsy Listing")).toBeOnTheScreen()
  })

  it("leaves out the estimate when the listing has none", () => {
    cardResaleSubmission = resaleSubmission({ estimate: null })
    renderWithRelay()

    expect(screen.queryByText(/Estimated Value/)).not.toBeOnTheScreen()
    expect(screen.getByText("Artsy Listing")).toBeOnTheScreen()
  })

  it("leaves out the date when the work has none", () => {
    cardResaleSubmission = resaleSubmission({})
    renderWithRelay({ Artwork: () => ({ title: "Untitled", date: null }) })

    expect(screen.getByText("Untitled")).toBeOnTheScreen()
  })
})
