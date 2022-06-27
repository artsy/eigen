import { fireEvent } from "@testing-library/react-native"
import { CreateArtworkAlertButtonsSectionTestsQuery } from "__generated__/CreateArtworkAlertButtonsSectionTestsQuery.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CreateArtworkAlertButtonsSectionFragmentContainer as CreateArtworkAlertButtonsSection } from "./CreateArtworkAlertButtonsSection"

jest.unmock("react-relay")

describe("CreateArtworkAlertButtonsSection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestRenderer = ({ auctionState }: { auctionState?: AuctionTimerState }) => {
    return (
      <QueryRenderer<CreateArtworkAlertButtonsSectionTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query CreateArtworkAlertButtonsSectionTestsQuery @relay_test_operation {
            artwork(id: "artwork-id") {
              ...CreateArtworkAlertButtonsSection_artwork
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artwork) {
            return (
              <CreateArtworkAlertButtonsSection
                artwork={props.artwork}
                auctionState={auctionState}
              />
            )
          }
          return null
        }}
      />
    )
  }

  it("should correctly 'Create Alert' modal", () => {
    const { queryByText, getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => Artwork,
    })

    fireEvent.press(getByText("Create Alert"))

    expect(queryByText("Banksy")).toBeTruthy()
    expect(queryByText("Limited Edition")).toBeTruthy()
    expect(queryByText("Prints")).toBeTruthy()
  })

  it("should not render create alert button and description text if artwork doesn't have any associated artists", () => {
    const { queryByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...Artwork,
        artists: [],
      }),
    })

    expect(queryByText("Be notified when a similar work is available")).toBeNull()
    expect(queryByText("Create Alert")).toBeNull()
  })

  it("should not render `Rarity` pill if needed data is missing", () => {
    const { getByText, queryByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...Artwork,
        attributionClass: null,
      }),
    })

    fireEvent.press(getByText("Create Alert"))

    expect(queryByText("Limited Edition")).toBeFalsy()
  })

  it("should not render `Medium` pill if needed data is missing", () => {
    const { getByText, queryByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...Artwork,
        mediumType: null,
      }),
    })

    fireEvent.press(getByText("Create Alert"))

    expect(queryByText("Prints")).toBeFalsy()
  })

  it("should not render `Contact Gallery` button", () => {
    const { getAllByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...Artwork,
        isInquireable: true,
      }),
    })

    expect(getAllByText("Contact Gallery").length).toBeGreaterThan(0)
  })

  it("should render `Bidding closed` title", () => {
    const { getByText } = renderWithWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.CLOSED} />
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
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
    const { getByText } = renderWithWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.CLOSED} />
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
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
