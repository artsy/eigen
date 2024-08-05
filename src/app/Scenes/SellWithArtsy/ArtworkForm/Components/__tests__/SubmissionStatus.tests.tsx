import { screen } from "@testing-library/react-native"
import { SubmissionStatusTestQuery } from "__generated__/SubmissionStatusTestQuery.graphql"
import { SubmissionStatus } from "app/Scenes/MyCollection/Components/SubmissionStatus"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.unmock("react-relay")

describe("SubmissionStatus", () => {
  const { renderWithRelay } = setupTestWrapper<SubmissionStatusTestQuery>({
    Component: (props) => {
      if (props.artwork) {
        return <SubmissionStatus {...(props as any)} />
      }
      return null
    },
    query: graphql`
      query SubmissionStatusTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...SubmissionStatus_artwork
        }
      }
    `,
  })

  it("displayas submission status when Approved", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "artwork-id",
        consignmentSubmission: {
          internalID: "submission-id",
          state: "APPROVED",
          stateLabel: "Approved",
          actionLabel: "Complete Listing",
        },
      }),
    })

    expect(screen.getByText("Approved")).toBeTruthy()
    expect(screen.getByText("Complete Listing")).toBeTruthy()
  })

  it("displayas submission status when Listed", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "artwork-id",
        isListed: true,
        consignmentSubmission: {},
      }),
    })

    expect(screen.getByText("Listed")).toBeTruthy()
  })
})
