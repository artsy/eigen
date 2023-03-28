import { fireEvent } from "@testing-library/react-native"
import { CreateArtworkAlertButtonsSectionTestsQuery } from "__generated__/CreateArtworkAlertButtonsSectionTestsQuery.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { CreateArtworkAlertButtonsSectionFragmentContainer as CreateArtworkAlertButtonsSection } from "./CreateArtworkAlertButtonsSection"

describe("CreateArtworkAlertButtonsSection", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = (auctionState?: AuctionTimerState) => {
    return setupTestWrapper<CreateArtworkAlertButtonsSectionTestsQuery>({
      Component: (props) => {
        if (props?.artwork) {
          return (
            <CreateArtworkAlertButtonsSection artwork={props.artwork} auctionState={auctionState} />
          )
        }
        return null
      },
      query: graphql`
        query CreateArtworkAlertButtonsSectionTestsQuery @relay_test_operation {
          artwork(id: "artwork-id") {
            ...CreateArtworkAlertButtonsSection_artwork
          }
        }
      `,
    })
  }

  it("should correctly 'Create Alert' modal", () => {
    const { queryByText, getByText } = setup().renderWithRelay({
      Artwork: () => Artwork,
    })

    fireEvent.press(getByText("Create Alert"))

    expect(queryByText("Banksy")).toBeTruthy()
    expect(queryByText("Limited Edition")).toBeTruthy()
    expect(queryByText("Prints")).toBeTruthy()
  })

  it("should not render create alert button and description text if artwork doesn't have any associated artists", () => {
    const { queryByText } = setup().renderWithRelay({
      Artwork: () => ({
        ...Artwork,
        artists: [],
      }),
    })

    expect(queryByText("Be notified when a similar work is available")).toBeNull()
    expect(queryByText("Create Alert")).toBeNull()
  })

  it("should not render `Rarity` pill if needed data is missing", () => {
    const { getByText, queryByText } = setup().renderWithRelay({
      Artwork: () => ({
        ...Artwork,
        attributionClass: null,
      }),
    })

    fireEvent.press(getByText("Create Alert"))

    expect(queryByText("Limited Edition")).toBeFalsy()
  })

  it("should not render `Medium` pill if needed data is missing", () => {
    const { getByText, queryByText } = setup().renderWithRelay({
      Artwork: () => ({
        ...Artwork,
        mediumType: null,
      }),
    })

    fireEvent.press(getByText("Create Alert"))

    expect(queryByText("Prints")).toBeFalsy()
  })

  it("should not render `Contact Gallery` button", () => {
    const { getAllByText } = setup().renderWithRelay({
      Artwork: () => ({
        ...Artwork,
        isInquireable: true,
      }),
    })

    expect(getAllByText("Contact Gallery").length).toBeGreaterThan(0)
  })

  it("should render `Bidding closed` title", () => {
    const { getByText } = setup(AuctionTimerState.CLOSED).renderWithRelay({
      Artwork: () => ({
        ...Artwork,
        isInAuction: true,
        sale: {
          internalID: "sale-id",
        },
      }),
    })

    expect(getByText("Bidding closed")).toBeTruthy()
  })

  it("should render `Sold` title", () => {
    const { getByText } = setup(AuctionTimerState.CLOSED).renderWithRelay({
      Artwork: () => ({
        ...Artwork,
        isSold: true,
      }),
    })

    expect(getByText("Sold")).toBeTruthy()
  })
})

const Artwork = {
  title: "Some artwork title",
  slug: "artwork-slug",
  internalID: "artwork-id",
  isInAuction: false,
  sale: null,
  artists: [
    {
      internalID: "4dd1584de0091e000100207c",
      name: "Banksy",
    },
  ],
  attributionClass: {
    internalID: "limited edition",
  },
  mediumType: {
    filterGene: {
      slug: "prints",
      name: "Prints",
    },
  },
}
