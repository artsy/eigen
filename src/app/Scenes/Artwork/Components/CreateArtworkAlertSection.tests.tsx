import { fireEvent } from "@testing-library/react-native"
import { CreateArtworkAlertSectionTestsQuery } from "__generated__/CreateArtworkAlertSectionTestsQuery.graphql"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CreateArtworkAlertSectionFragmentContainer } from "./CreateArtworkAlertSection"

jest.unmock("react-relay")

describe("CreateArtworkAlertSection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<CreateArtworkAlertSectionTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query CreateArtworkAlertSectionTestsQuery @relay_test_operation {
            artwork(id: "artwork-id") {
              ...CreateArtworkAlertSection_artwork
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artwork) {
            return <CreateArtworkAlertSectionFragmentContainer artwork={props.artwork} />
          }
          return null
        }}
      />
    )
  }

  it("should correctly render placeholder", () => {
    const placeholder = "Artworks like: Some artwork title"
    const { getAllByText, getAllByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Artwork: () => Artwork,
    })

    fireEvent.press(getAllByText("Create Alert")[0])

    expect(getAllByPlaceholderText(placeholder)).toBeTruthy()
  })

  it("should correctly render pills", () => {
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
})

const Artwork = {
  title: "Some artwork title",
  slug: "artwork-slug",
  internalID: "artwork-id",
  artists: [
    {
      internalID: "4dd1584de0091e000100207c",
      name: "Banksy",
      slug: "banksy",
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
