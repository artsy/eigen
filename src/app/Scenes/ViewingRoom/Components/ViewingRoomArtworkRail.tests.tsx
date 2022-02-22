import { ViewingRoomArtworkRailTestsQuery } from "__generated__/ViewingRoomArtworkRailTestsQuery.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { postEventToProviders } from "app/utils/track/providers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { tracks, ViewingRoomArtworkRailContainer } from "./ViewingRoomArtworkRail"

jest.unmock("react-relay")
jest.unmock("react-tracking")

describe("ViewingRoomArtworkRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomArtworkRailTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ViewingRoomArtworkRailTestsQuery {
          viewingRoom(id: "unused") {
            ...ViewingRoomArtworkRail_viewingRoom
          }
        }
      `}
      render={renderWithLoadProgress(ViewingRoomArtworkRailContainer)}
      variables={{}}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders a title for the rail", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation)
      return result
    })
    expect(tree.root.findAllByType(SectionTitle)).toHaveLength(1)
  })

  it("navigates to the artworks screen + calls tracking when title is tapped", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          slug: "gallery-name-viewing-room-name",
          internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        }),
      })
      return result
    })
    tree.root.findByType(SectionTitle).props.onPress()

    expect(navigate).toHaveBeenCalledWith("/viewing-room/gallery-name-viewing-room-name/artworks")
    expect(postEventToProviders).toHaveBeenCalledWith(
      tracks.tappedArtworkGroupHeader(
        "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        "gallery-name-viewing-room-name"
      )
    )
  })

  it("renders artworks", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          artworks: {
            edges: [
              {
                node: {
                  href: "/artwork/nicolas-party-rocks-ii",
                  internalID: "5deff4b96fz7e7000f36ce37",
                  slug: "nicolas-party-rocks-ii",
                  artistNames: ["Nicolas Party"],
                  image: {
                    imageURL:
                      "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
                  },
                  saleMessage: "$20,000",
                },
              },
              {
                node: {
                  internalID: "5d14c764d2f1db001243a81e",
                  slug: "nicolas-party-still-life-no-011",
                  artistNames: "Nicolas Party",
                  href: "/artwork/nicolas-party-still-life-no-011",
                  saleMessage: "$25,000",
                  image: {
                    imageURL:
                      "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
                  },
                },
              },
            ],
          },
        }),
      })
      return result
    })
    expect(tree.root.findAllByType(ArtworkRailCard)).toHaveLength(2)
  })
})
