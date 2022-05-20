import { fireEvent } from "@testing-library/react-native"
import { CreateArtworkAlertButtonsSectionTestsQuery } from "__generated__/CreateArtworkAlertButtonsSectionTestsQuery.graphql"
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

  const TestRenderer = () => {
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
            return <CreateArtworkAlertButtonsSection artwork={props.artwork} />
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
})

const Artwork = {
  title: "Some artwork title",
  slug: "artwork-slug",
  internalID: "artwork-id",
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
