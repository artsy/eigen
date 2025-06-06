import { fireEvent } from "@testing-library/react-native"
import { OtherWorksTestsQuery } from "__generated__/OtherWorksTestsQuery.graphql"
import { OtherWorksFragmentContainer } from "app/Scenes/Artwork/Components/OtherWorks/OtherWorks"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OtherWorks", () => {
  const { renderWithRelay } = setupTestWrapper<OtherWorksTestsQuery>({
    Component: (props) => {
      if (props?.artwork) {
        return <OtherWorksFragmentContainer artwork={props.artwork} />
      }

      return null
    },
    query: graphql`
      query OtherWorksTestsQuery @relay_test_operation {
        artwork(id: "artworkId") {
          ...OtherWorks_artwork
        }
      }
    `,
  })

  it("renders no grids if there are none provided", () => {
    const { toJSON } = renderWithRelay({
      Artwork: () => ({
        contextGrids: null,
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders no grids if an empty array is provided", () => {
    const { toJSON } = renderWithRelay({
      Artwork: () => ({
        contextGrids: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders the grid if one is provided", () => {
    const { getByText, getByLabelText } = renderWithRelay({
      Artwork: () => ({
        contextGrids: [firstArtworkGridItem],
      }),
    })

    expect(getByText("Other works by Andy Warhol")).toBeTruthy()

    fireEvent.press(getByLabelText("Context Grid CTA"))
    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })

  it("renders the grids if multiple are provided", () => {
    const { getByText, getAllByLabelText } = renderWithRelay({
      Artwork: () => ({
        contextGrids: [firstArtworkGridItem, secondArtworkGridItem],
      }),
    })

    expect(getByText("Other works by Andy Warhol")).toBeTruthy()
    expect(getByText("View all works from Gagosian Gallery")).toBeTruthy()

    const buttons = getAllByLabelText("Context Grid CTA")

    fireEvent.press(buttons[0])
    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")

    fireEvent.press(buttons[1])
    expect(navigate).toHaveBeenCalledWith("/gagosian-gallery")
  })

  it("renders only grids with artworks", () => {
    const contextGrids = [
      firstArtworkGridItem,
      {
        title: "Other works from Gagosian Gallery",
        ctaTitle: "View all works from Gagosian Gallery",
        ctaHref: "/gagosian-gallery",
        artworks: null,
      },
      {
        title: "Other works from Gagosian Gallery at Art Basel 2019",
        ctaTitle: "View all works from the booth",
        ctaHref: "/show/gagosian-gallery-at-art-basel-2019",
        artworks: { edges: [] },
      },
    ]

    const { getByText, queryByText } = renderWithRelay({
      Artwork: () => ({
        contextGrids,
      }),
    })

    expect(getByText("Other works by Andy Warhol")).toBeTruthy()
    expect(queryByText("Other works from Gagosian Gallery")).toBeFalsy()
    expect(queryByText("View all works from the booth")).toBeFalsy()
  })
})

const firstArtworkGridItem = {
  title: "Other works by Andy Warhol",
  ctaTitle: "View all works by Andy Warhol",
  ctaHref: "/artist/andy-warhol",
  artworks: {
    edges: [
      {
        node: {
          id: "artwork1",
        },
      },
    ],
  },
}

const secondArtworkGridItem = {
  title: "Other works from Gagosian Gallery",
  ctaTitle: "View all works from Gagosian Gallery",
  ctaHref: "/gagosian-gallery",
  artworks: {
    edges: [
      {
        node: { id: "artwork1" },
      },
    ],
  },
}
