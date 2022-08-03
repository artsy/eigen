import { ArtistAboutTestsQuery } from "__generated__/ArtistAboutTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ModalStack } from "app/navigation/ModalStack"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import Biography from "../Biography"
import { ArtistAboutContainer } from "./ArtistAbout"
import { ArtistAboutShowsFragmentContainer } from "./ArtistAboutShows"

describe("ArtistAbout", () => {
  const TestRenderer = () => (
    <QueryRenderer<ArtistAboutTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ArtistAboutTestsQuery($artistID: String!) @relay_test_operation {
          artist(id: $artistID) {
            ...ArtistAbout_artist
          }
        }
      `}
      variables={{ artistID: "artist-id" }}
      render={({ props }) => {
        if (!props?.artist) {
          return null
        }
        return (
          <ModalStack>
            <StickyTabPage
              tabs={[
                {
                  title: "test",
                  content: <ArtistAboutContainer artist={props.artist} />,
                },
              ]}
            />
          </ModalStack>
        )
      }}
    />
  )

  describe("Biography", () => {
    it("is shown when the artist has metadata", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)

      resolveMostRecentRelayOperation({
        Boolean: (context) => {
          if (context.name === "hasMetadata") {
            return true
          }
        },
      })

      expect(tree.root.findAllByType(Biography).length).toEqual(1)
    })

    it("is hidden when the artist has metadata", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)

      resolveMostRecentRelayOperation({
        Boolean: (context) => {
          if (context.name === "hasMetadata") {
            return false
          }
        },
      })

      expect(tree.root.findAllByType(Biography).length).toEqual(0)
    })
  })

  describe("ArtistAboutShows", () => {
    it("is rendered by default", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)

      resolveMostRecentRelayOperation()

      expect(tree.root.findAllByType(ArtistAboutShowsFragmentContainer).length).toEqual(1)
    })
  })
})
