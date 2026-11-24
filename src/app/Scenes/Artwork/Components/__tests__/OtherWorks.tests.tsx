import { fireEvent, screen } from "@testing-library/react-native"
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

  it("renders no grids if there are none provided", async () => {
    const { toJSON } = await renderWithRelay({
      Artwork: () => ({
        contextGrids: null,
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders no grids if an empty array is provided", async () => {
    const { toJSON } = await renderWithRelay({
      Artwork: () => ({
        contextGrids: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders the grid if one is provided", async () => {
    await renderWithRelay({
      Artwork: () => ({
        contextGrids: [firstArtworkGridItem],
      }),
    })

    expect(screen.getByText("Other works by Andy Warhol")).toBeOnTheScreen()

    await fireEvent.press(screen.getByLabelText("Context Grid CTA"))
    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })

  it("renders the grids if multiple are provided", async () => {
    await renderWithRelay({
      Artwork: () => ({
        contextGrids: [firstArtworkGridItem, secondArtworkGridItem],
      }),
    })

    expect(screen.getByText("Other works by Andy Warhol")).toBeOnTheScreen()
    expect(screen.getByText("View all works from Gagosian Gallery")).toBeOnTheScreen()

    const buttons = screen.getAllByLabelText("Context Grid CTA")

    await fireEvent.press(buttons[0])
    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")

    await fireEvent.press(buttons[1])
    expect(navigate).toHaveBeenCalledWith("/gagosian-gallery")
  })

  it("renders only grids with artworks", async () => {
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

    await renderWithRelay({
      Artwork: () => ({
        contextGrids,
      }),
    })

    expect(screen.getByText("Other works by Andy Warhol")).toBeOnTheScreen()
    expect(screen.queryByText("Other works from Gagosian Gallery")).not.toBeOnTheScreen()
    expect(screen.queryByText("View all works from the booth")).not.toBeOnTheScreen()
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
