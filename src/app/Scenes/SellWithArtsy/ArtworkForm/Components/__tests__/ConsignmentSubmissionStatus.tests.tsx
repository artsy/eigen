import { screen } from "@testing-library/react-native"
import { ConsignmentSubmissionStatusTestQuery } from "__generated__/ConsignmentSubmissionStatusTestQuery.graphql"
import { ConsignmentSubmissionStatusFragmentContainer } from "app/Scenes/MyCollection/Components/ConsignmentSubmissionStatus"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.unmock("react-relay")

describe("ConsignmentSubmissionStatus", () => {
  const { renderWithRelay } = setupTestWrapper<ConsignmentSubmissionStatusTestQuery>({
    Component: (props) => {
      if (props.artwork) {
        return <ConsignmentSubmissionStatusFragmentContainer {...(props as any)} />
      }
      return null
    },
    query: graphql`
      query ConsignmentSubmissionStatusTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...ConsignmentSubmissionStatus_artwork
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
