import { fireEvent } from "@testing-library/react-native"
import { CreateArtworkAlertSectionTestsQuery } from "__generated__/CreateArtworkAlertSectionTestsQuery.graphql"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { CreateArtworkAlertSectionFragmentContainer } from "./CreateArtworkAlertSection"

describe("CreateArtworkAlertSection", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper<CreateArtworkAlertSectionTestsQuery>({
    Component: (props) => {
      if (props?.artwork) {
        return <CreateArtworkAlertSectionFragmentContainer artwork={props.artwork} />
      }
      return null
    },
    query: graphql`
      query CreateArtworkAlertSectionTestsQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...CreateArtworkAlertSection_artwork
        }
      }
    `,
  })

  it("should correctly render placeholder", () => {
    const placeholder = "Artworks like: Some artwork title"
    const { getByText, getAllByPlaceholderText } = renderWithRelay({
      Artwork: () => Artwork,
    })

    fireEvent.press(getByText("Create Alert"))

    expect(getAllByPlaceholderText(placeholder)).toBeTruthy()
  })

  it("should correctly render pills", () => {
    const { getByText, queryByText } = renderWithRelay({
      Artwork: () => Artwork,
    })

    fireEvent.press(getByText("Create Alert"))

    expect(queryByText("Banksy")).toBeTruthy()
    expect(queryByText("Limited Edition")).toBeTruthy()
    expect(queryByText("Prints")).toBeTruthy()
  })

  it("should not render `Rarity` pill if needed data is missing", () => {
    const { getByText, queryByText } = renderWithRelay({
      Artwork: () => ({
        ...Artwork,
        attributionClass: null,
      }),
    })

    fireEvent.press(getByText("Create Alert"))

    expect(queryByText("Limited Edition")).toBeFalsy()
  })

  it("should not render `Medium` pill if needed data is missing", () => {
    const { getByText, queryByText } = renderWithRelay({
      Artwork: () => ({
        ...Artwork,
        mediumType: null,
      }),
    })

    fireEvent.press(getByText("Create Alert"))

    expect(queryByText("Prints")).toBeFalsy()
  })

  it("should correctly track event when `Create Alert` button is pressed", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => Artwork,
    })

    fireEvent.press(getByText("Create Alert"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedCreateAlert",
          "context_module": "ArtworkTombstone",
          "context_screen_owner_id": "artwork-id",
          "context_screen_owner_slug": "artwork-slug",
          "context_screen_owner_type": "artwork",
        },
      ]
    `)
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
