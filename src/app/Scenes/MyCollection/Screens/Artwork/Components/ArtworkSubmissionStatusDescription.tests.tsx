import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkSubmissionStatusDescriptionTestsQuery } from "__generated__/ArtworkSubmissionStatusDescriptionTestsQuery.graphql"
import { ArtworkSubmissionStatusDescription } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkSubmissionStatusDescription"
import { navigate } from "app/system/navigation/navigate"
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
          <ArtworkSubmissionStatusDescription artworkData={props.artwork} closeModal={() => {}} />
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

    // test that the stateHelpMessage is displayed correctly when part of it is coming from the server
    // and some part is hardcoded
    expect(screen.getByText("Rejected Message", { exact: false })).toBeTruthy()
    expect(screen.getByText("Find out more about our", { exact: false })).toBeTruthy()

    expect(screen.getByText("Rejected Button Label")).toBeTruthy()
    expect(screen.getByText("Rejected Action Label")).toBeTruthy()

    fireEvent.press(screen.getByText("submission criteria"))
    expect(navigate).toHaveBeenCalledWith(
      "https://support.artsy.net/s/article/What-items-do-you-accept"
    )
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
