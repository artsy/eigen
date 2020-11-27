import { ArtistAboutTestsQuery } from "__generated__/ArtistAboutTestsQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import Biography from "../../Biography"
import { ArtistAboutContainer } from "../ArtistAbout"
import { ArtistAboutShowsFragmentContainer } from "../ArtistAboutShows"

jest.unmock("react-relay")

describe("ArtistAbout", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<ArtistAboutTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistAboutTestsQuery($artistID: String!) @relay_test_operation {
          artist(id: $artistID) {
            ...ArtistAbout_artist
          }
        }
      `}
      variables={{ artistID: "artist-id" }}
      render={({ props }) => {
        if (props?.artist) {
          return <ArtistAboutContainer artist={props.artist} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  describe("Biography", () => {
    it("is shown when the artist has metadata", () => {
      const tree = renderWithWrappers(<TestRenderer />)

      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Boolean: (context) => {
            if (context.name === "hasMetadata") {
              return true
            }
          },
        })
      )

      expect(tree.root.findAllByType(Biography).length).toEqual(1)
    })

    it("is hidden when the artist has metadata", () => {
      const tree = renderWithWrappers(<TestRenderer />)

      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Boolean: (context) => {
            if (context.name === "hasMetadata") {
              return false
            }
          },
        })
      )

      expect(tree.root.findAllByType(Biography).length).toEqual(0)
    })
  })

  describe("AuctionResults", () => {
    it("is shown when isDisplayAuctionLink is true", () => {
      const tree = renderWithWrappers(<TestRenderer />)

      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Boolean: (context) => {
            if (context.name === "isDisplayAuctionLink") {
              return true
            }
          },
        })
      )

      expect(tree.root.findAllByType(CaretButton).length).toEqual(1)
    })

    it("is hidden when isDisplayAuctionLink is false", () => {
      const tree = renderWithWrappers(<TestRenderer />)

      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Boolean: (context) => {
            if (context.name === "isDisplayAuctionLink") {
              return false
            }
          },
        })
      )

      expect(tree.root.findAllByType(CaretButton).length).toEqual(0)
    })
  })

  describe("ArtistAboutShows", () => {
    it("is shown when AROptionsNewInsightsPage is true", () => {
      __globalStoreTestUtils__?.injectEmissionOptions({ AROptionsNewInsightsPage: true })

      const tree = renderWithWrappers(<TestRenderer />)

      mockEnvironment.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, {}))

      expect(tree.root.findAllByType(ArtistAboutShowsFragmentContainer).length).toEqual(1)
    })

    it("is hidden when AROptionsNewInsightsPage is false", () => {
      __globalStoreTestUtils__?.injectEmissionOptions({ AROptionsNewInsightsPage: false })

      const tree = renderWithWrappers(<TestRenderer />)

      mockEnvironment.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, {}))

      expect(tree.root.findAllByType(ArtistAboutShowsFragmentContainer).length).toEqual(0)
    })
  })
})
