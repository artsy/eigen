import { fireEvent } from "@testing-library/react-native"
import { CreateArtworkAlertButtonsSectionTestsQuery } from "__generated__/CreateArtworkAlertButtonsSectionTestsQuery.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
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
    const { getAllByText, getByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Artwork: () => Artwork,
    })

    fireEvent.press(getAllByText("Create Alert")[0])

    expect(getByText("Banksy")).toBeTruthy()
    expect(getByText("Limited Edition")).toBeTruthy()
    expect(getByText("Prints")).toBeTruthy()
  })

  it("should not render `Rarity` pill if needed data is missing", () => {
    const { getAllByText, queryByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Artwork: () => ({
        ...Artwork,
        attributionClass: null,
      }),
    })

    fireEvent.press(getAllByText("Create Alert")[0])

    expect(queryByText("Limited Edition")).toBeFalsy()
  })

  it("should not render `Medium` pill if needed data is missing", () => {
    const { getAllByText, queryByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Artwork: () => ({
        ...Artwork,
        mediumType: null,
      }),
    })

    fireEvent.press(getAllByText("Create Alert")[0])

    expect(queryByText("Prints")).toBeFalsy()
  })

  it("should not render `Contact Gallery` button", () => {
    const { getAllByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
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

    mockEnvironmentPayload(mockEnvironment, {
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

    mockEnvironmentPayload(mockEnvironment, {
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
