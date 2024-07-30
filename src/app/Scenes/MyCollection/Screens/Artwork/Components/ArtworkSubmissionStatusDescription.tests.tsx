import { screen } from "@testing-library/react-native"
import { ArtworkSubmissionStatusDescriptionTestsQuery } from "__generated__/ArtworkSubmissionStatusDescriptionTestsQuery.graphql"
import { ArtworkSubmissionStatusDescription } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkSubmissionStatusDescription"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/Scenes/SellWithArtsy/ArtworkForm/Utils/fetchArtworkInformation", () => ({
  fetchArtworkInformation: () => Promise.resolve(artworkWithoutSubmission),
}))

describe("ArtworkSubmissionStatusDescription", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkSubmissionStatusDescriptionTestsQuery>({
    Component: (props) => {
      if (props?.artwork) {
        return (
          <ArtworkSubmissionStatusDescription
            artworkData={props.artwork}
            closeModal={() => {}}
            visible={true}
          />
        )
      } else {
        return null
      }
    },
    query: graphql`
      query ArtworkSubmissionStatusDescriptionTestsQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...ArtworkSubmissionStatusDescription_artwork
        }
      }
    `,
  })

  describe("Artwork without submission ", () => {
    it("doesn't render the component if submission doesn't exists", async () => {
      renderWithRelay({
        Artwork: () => artworkWithoutSubmission,
      })

      expect(screen.queryByTestId("ArtworkSubmissionStatusDescription-Container")).toBe(null)
    })
  })

  describe("Artwork with submission ", () => {
    it("APPROVED state (or any other)", () => {
      renderWithRelay({
        Artwork: () => approvedSubmission,
      })

      expect(screen.getByText("Approved")).toBeTruthy()
      expect(screen.getByText("Approved Message")).toBeTruthy()
      expect(screen.getByText("Approved Button Label")).toBeTruthy()
      expect(screen.getByText("Approved Action Label")).toBeTruthy()
    })

    it("LISTED state", () => {
      renderWithRelay({
        Artwork: () => listedSubmission,
      })

      expect(screen.getByText("Listed")).toBeTruthy()
      expect(screen.getByText("View Listing")).toBeTruthy()
    })
  })

  it("REJECTED state", () => {
    renderWithRelay({
      Artwork: () => rejectedSubmission,
    })

    expect(screen.getByText("Rejected")).toBeTruthy()
    expect(screen.getByText("Rejected Message")).toBeTruthy()
    expect(screen.getByText("Rejected Button Label")).toBeTruthy()
    expect(screen.getByText("Rejected Action Label")).toBeTruthy()
  })
})

const artworkWithoutSubmission = {
  submissionId: null,
  consignmentSubmission: null,
}

const approvedSubmission = {
  submissionId: "someId",
  consignmentSubmission: {
    state: "APPROVED",
    stateLabel: "Approved",
    stateHelpMessage: "Approved Message",
    buttonLabel: "Approved Button Label",
    actionLabel: "Approved Action Label",
  },
}

const rejectedSubmission = {
  submissionId: "someId",
  consignmentSubmission: {
    state: "REJECTED",
    stateLabel: "Rejected",
    stateHelpMessage: "Rejected Message",
    buttonLabel: "Rejected Button Label",
    actionLabel: "Rejected Action Label",
  },
}

const listedSubmission = {
  submissionId: "someId",
  isListed: true,
  consignmentSubmission: {},
}
