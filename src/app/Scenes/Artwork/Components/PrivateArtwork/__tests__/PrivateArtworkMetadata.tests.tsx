import { fireEvent, screen } from "@testing-library/react-native"
import { PrivateArtworkMetadataQuery } from "__generated__/PrivateArtworkMetadataQuery.graphql"
import { PrivateArtworkMetadata } from "app/Scenes/Artwork/Components/PrivateArtwork/PrivateArtworkMetadata"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
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
          privateProvenance: "Test Provenance Details",
        }
      },
    })
    expect(screen.getByText("Test Provenance Details")).toBeTruthy()
  })

  it("does not display provenance info when provenance is not present", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          privateProvenance: null,
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
          privateProvenance: null,
          privateExhibitionHistory: "Test Exhibition History Details",
        }
      },
    })
    expect(screen.getByText("Test Exhibition History Details")).toBeTruthy()
  })

  it("does not display exhibition history when exhibition history is not present", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          privateExhibitionHistory: null,
        }
      },
    })
    expect(screen.queryByText("Test Exhibition History Details")).not.toBeTruthy()
  })

  it("tracks condition expand press", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          conditionDescription: {
            details: "Test Condition Description Details",
          },
        }
      },
    })

    fireEvent.press(screen.getAllByTestId("expandableAccordion")[0])
    expect(mockTrackEvent).toBeCalledWith({
      context_module: "aboutTheWork",
      context_owner_type: "artwork",
      expand: true,
      subject: "Condition",
    })
  })

  it("tracks provenance expand press", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          privateProvenance: "Test Provenance Details",
        }
      },
    })

    fireEvent.press(screen.getAllByTestId("expandableAccordion")[1])
    expect(mockTrackEvent).toBeCalledWith({
      context_module: "aboutTheWork",
      context_owner_type: "artwork",
      expand: false,
      subject: "Provenance",
    })
  })

  it("tracks exhibition history expand press", async () => {
    renderWithRelay({
      Artwork: () => {
        return {
          privateExhibitionHistory: "Test Exhibition History Details",
        }
      },
    })

    fireEvent.press(screen.getAllByTestId("expandableAccordion")[2])
    expect(mockTrackEvent).toBeCalledWith({
      context_module: "aboutTheWork",
      context_owner_type: "artwork",
      expand: false,
      subject: "Exhibition History",
    })
  })
})
