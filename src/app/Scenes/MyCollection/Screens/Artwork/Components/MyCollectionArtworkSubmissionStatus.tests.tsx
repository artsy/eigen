import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionArtworkSubmissionStatusTestQuery } from "__generated__/MyCollectionArtworkSubmissionStatusTestQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MyCollectionArtworkSubmissionStatus } from "./MyCollectionArtworkSubmissionStatus"

describe("MyCollectionArtworkSubmissionStatus", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionArtworkSubmissionStatusTestQuery>({
    Component: (props) => <MyCollectionArtworkSubmissionStatus artwork={props.artwork!} />,
    query: graphql`
      query MyCollectionArtworkSubmissionStatusTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...MyCollectionArtworkSubmissionStatus_submissionState
        }
      }
    `,
  })

  it("Displays nothing when there is no submission", () => {
    renderWithRelay({
      Artwork: () => {
        return {
          consignmentSubmission: null,
        }
      },
    })

    expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).toBe(null)
  })

  it("displays submission status even if state is DRAFT", () => {
    renderWithRelay({
      Artwork: () => {
        return {
          consignmentSubmission: {
            externalID: "some-external-id",
            state: "DRAFT",
            actionLabel: "Complete Submission",
          },
        }
      },
    })

    expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).not.toBe(null)
    expect(screen.queryAllByText("Complete Submission")).toHaveLength(2)
  })

  it("displays submission status in LISTED state", () => {
    renderWithRelay({
      Artwork: () => {
        return {
          isListed: true,
          internalID: "artwork-id",
          consignmentSubmission: {
            externalID: "some-external-id",
          },
        }
      },
    })

    expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).not.toBe(null)
    expect(screen.queryAllByText("Listed")).toHaveLength(2)
  })

  it("does not display action label in LISTED state", () => {
    renderWithRelay({
      Artwork: () => {
        return {
          isListed: true,
          internalID: "artwork-id",
          consignmentSubmission: {
            externalID: "some-external-id",
            state: "APPROVED",
            actionLabel: "Complete Listing",
          },
        }
      },
    })

    expect(screen.queryByTestId("action-label")).toBe(null)
  })

  it("display Submission status in REJECTED state", () => {
    renderWithRelay({
      Artwork: () => {
        return {
          consignmentSubmission: {
            externalID: "some-external-id",
            state: "REJECTED",
            stateLabel: "Submission Unsuccessful",
          },
        }
      },
    })

    expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).not.toBe(null)
    expect(screen.queryAllByText("Submission Unsuccessful")).toHaveLength(2)
  })

  it("navigatess to submission flow ShippingLocation when action label is pressed and Tier 2", () => {
    renderWithRelay({
      Artwork: () => {
        return {
          isListed: false,
          internalID: "artwork-id",
          consignmentSubmission: {
            externalID: "some-external-id",
            state: "APPROVED",
            actionLabel: "Complete Listing",
          },
        }
      },
    })

    expect(screen.queryAllByText("Complete Listing")).toHaveLength(2)
    fireEvent.press(screen.getByTestId("action-label"))
    expect(navigate).toHaveBeenCalledWith("/sell/submissions/some-external-id/edit", {
      passProps: {
        hasStartedFlowFromMyCollection: true,
        initialStep: "ShippingLocation",
        initialValues: {},
      },
    })
  })

  it("navigatess to submission flow ShippingLocation when action label is pressed and Tier 2", () => {
    renderWithRelay({
      Artwork: () => {
        return {
          isListed: false,
          internalID: "artwork-id",
          consignmentSubmission: {
            externalID: "some-external-id",
            state: "DRAFT",
            actionLabel: "Complete Submission",
          },
        }
      },
    })

    expect(screen.queryAllByText("Complete Submission")).toHaveLength(2)
    fireEvent.press(screen.getByTestId("action-label"))
    expect(navigate).toHaveBeenCalledWith("/sell/submissions/some-external-id/edit", {
      passProps: {
        hasStartedFlowFromMyCollection: true,
        initialStep: "AddTitle",
        initialValues: {},
      },
    })
  })
})
