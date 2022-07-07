import { fireEvent } from "@testing-library/react-native"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ArtistCollectionsRail } from "./ArtistCollectionsRail"

describe("Artist Series Rail", () => {
  it("renders all collections", async () => {
    const { getByText } = renderWithWrappers(
      <ArtistCollectionsRail
        artist={artistMockData as any}
        collections={collectionsMockData as any}
      />
    )

    expect(getByText("Cindy Sherman: Untitled Film Stills")).toBeTruthy()
    expect(getByText("Damien Hirst: Butterflies")).toBeTruthy()
    expect(getByText("Hunt Slonem: Bunnies")).toBeTruthy()
  })

  it("tracks clicks to a collection", async () => {
    const { getByText } = renderWithWrappers(
      <ArtistCollectionsRail
        artist={artistMockData as any}
        collections={collectionsMockData as any}
      />
    )

    fireEvent.press(getByText("Cindy Sherman: Untitled Film Stills"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action_type": "tappedCollectionGroup",
          "context_module": "artistSeriesRail",
          "context_screen_owner_id": "artist0",
          "context_screen_owner_slug": "david-hockney",
          "context_screen_owner_type": "Artist",
          "destination_screen_owner_id": "coll0",
          "destination_screen_owner_slug": "cindy-sherman-untitled-film-stills",
          "destination_screen_owner_type": "Collection",
          "horizontal_slide_position": 0,
          "type": "thumbnail",
        },
      ]
    `)
  })
})

const artistMockData = {
  id: "sdfsdfsdfsdf",
  internalID: "artist0",
  slug: "david-hockney",
}

const collectionsMockData = [
  {
    id: "coll0",
    slug: "cindy-sherman-untitled-film-stills",
    title: "Cindy Sherman: Untitled Film Stills",
    priceGuidance: 20000,
    artworksConnection: {
      id: "conn0",
      edges: [
        {
          node: {
            id: "artwork0",
            title: "Untitled (Film Still) Tray",
            image: {
              url: "https://cindy-sherman-untitled-film-stills/medium.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork1",
            title: "Untitled (Film Still) Tray 2",
            image: {
              url: "https://cindy-sherman-untitled-film-stills-2/medium.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork2",
            title: "Untitled (Film Still) Tray 3",
            image: {
              url: "https://cindy-sherman-untitled-film-stills-3/medium.jpg",
            },
          },
        },
      ],
    },
  },
  {
    id: "coll2",
    slug: "damien-hirst-butterflies",
    title: "Damien Hirst: Butterflies",
    priceGuidance: 7500,
    artworksConnection: {
      id: "conn2",
      edges: [
        {
          node: {
            id: "artwork0",
            title: "Untitled (Film Still) Tray",
            image: {
              url: "https://damien-hirst-butterflies/larger.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork1",
            title: "Untitled (Film Still) Tray 2",
            image: {
              url: "https://damien-hirst-butterflies-2/larger.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork2",
            title: "Untitled (Film Still) Tray 3",
            image: {
              url: "https://damien-hirst-butterflies-3/larger.jpg",
            },
          },
        },
      ],
    },
  },
  {
    id: "coll1",
    slug: "hunt-slonem-bunnies",
    title: "Hunt Slonem: Bunnies",
    priceGuidance: 2000,
    artworksConnection: {
      id: "conn1",
      edges: [
        {
          node: {
            id: "artwork0",
            title: "Untitled",
            image: {
              url: "https://hunt-slonem-bunnies/medium.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork1",
            title: "Untitled2",
            image: {
              url: "https://hunt-slonem-bunnies-2/medium.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork2",
            title: "Untitled3",
            image: {
              url: "https://hunt-slonem-bunnies-3/medium.jpg",
            },
          },
        },
      ],
    },
  },
]
