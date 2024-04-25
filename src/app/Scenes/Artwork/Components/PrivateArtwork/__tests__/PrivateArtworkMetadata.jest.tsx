import { screen } from "@testing-library/react-native"
import { PrivateArtworkMetadataQuery } from "__generated__/PrivateArtworkMetadataQuery.graphql"
import { PrivateArtworkMetadata } from "app/Scenes/Artwork/Components/PrivateArtwork/PrivateArtworkMetadata"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.unmock("react-relay")

describe("PrivateArtworkMetadata", () => {
  const { renderWithRelay } = setupTestWrapper<PrivateArtworkMetadataQuery>({
    Component: (props) => <PrivateArtworkMetadata artwork={props.artwork as any} />,
    query: graphql`
      query PrivateArtworkMetadataQuery {
        artwork(id: "foo") {
          ...PrivateArtworkMetadata_artwork
        }
      }
    `,
  })

  it("displays condition info when condition info is present", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          conditionDescription: {
            details: "Test Condition Description Details",
          },
        }
      },
    })
    expect(screen.getByText("Test Condition Description Details")).toBeTruthy()
  })

  it("does not display condition info when condition info is not present", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          conditionDescription: {
            details: null,
          },
        }
      },
    })
    expect(screen.queryByText("Test Condition Description Details")).not.toBeTruthy()
  })

  it("displays provenance info by default when provenance is present and conditionDescription is lacking", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          conditionDescription: {
            details: null,
          },
          provenance: "Test Provenance Details",
        }
      },
    })
    expect(screen.getByText("Test Provenance Details")).toBeTruthy()
  })

  it("does not display provenance info when provenance is not present", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          provenance: null,
        }
      },
    })
    expect(screen.queryByText("Test Provenance Details")).not.toBeTruthy()
  })

  it("displays exhibition history by default when exhibition history is present yet other options are null", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          conditionDescription: {
            details: null,
          },
          provenance: null,
          exhibitionHistory: "Test Exhibition History Details",
        }
      },
    })
    expect(screen.getByText("Test Exhibition History Details")).toBeTruthy()
  })

  it("does not display exhibition history when exhibition history is not present", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          exhibitionHistory: null,
        }
      },
    })
    expect(screen.queryByText("Test Exhibition History Details")).not.toBeTruthy()
  })
})
