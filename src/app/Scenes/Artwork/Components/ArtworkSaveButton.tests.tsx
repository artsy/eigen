import { ArtworkSaveButton } from "app/Scenes/Artwork/Components/ArtworkSaveButton"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkSaveButton", () => {
  setupTestWrapper({
    Component: ({ artwork }) => {
      return <ArtworkSaveButton artwork={artwork} />
    },
    query: graphql`
      query ArtworkSaveButtonTestsQuery @relay_test_operation {
        artwork(id: "some-artwork-id") {
          ...ArtworkSaveButton_artwork
        }
    `,
  })
})
