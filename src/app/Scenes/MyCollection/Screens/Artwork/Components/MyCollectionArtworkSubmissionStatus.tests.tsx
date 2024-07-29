import { screen } from "@testing-library/react-native"
import { MyCollectionArtworkSubmissionStatusTestQuery } from "__generated__/MyCollectionArtworkSubmissionStatusTestQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
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

  it("Displays nothing if state is DRAFT", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableSubmitArtworkTier2Information: false,
    })

    renderWithRelay({
      Artwork: () => {
        return {
          consignmentSubmission: {
            state: "DRAFT",
          },
        }
      },
    })

    expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).toBe(null)
  })

  it("display Submission status and In Progress when submission is in progress", () => {
    renderWithRelay({
      Artwork: () => {
        return {
          consignmentSubmission: {
            state: "SUBMITTED",
            stateLabel: "In Progress",
          },
        }
      },
    })

    expect(screen.getByText("Submission Status")).toBeDefined()
    expect(screen.getByText("In Progress")).toBeDefined()
  })

  it("display Submission status and Evaluation Complete when submission has been evaluated", () => {
    renderWithRelay({
      Artwork: () => {
        return {
          consignmentSubmission: {
            state: "REJECTED",
            stateLabel: "Evaluation Complete",
          },
        }
      },
    })

    expect(screen.getByText("Submission Status")).toBeDefined()
    expect(screen.getByText("Evaluation Complete")).toBeDefined()
  })

  describe("AREnableSubmitArtworkTier2Information feature flag is on", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableSubmitArtworkTier2Information: true,
      })
    })

    it("displays submission status even if state is DRAFT when the feature is live", () => {
      renderWithRelay({
        Artwork: () => {
          return {
            consignmentSubmission: {
              state: "DRAFT",
              actionLabel: "Complete Submission",
            },
          }
        },
      })

      expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).not.toBe(null)
      expect(screen.getByText("Complete Submission")).toBeDefined()
    })

    it("displays submission status in LISTED state when the feature is live", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableSubmitArtworkTier2Information: true,
      })

      renderWithRelay({
        Artwork: () => {
          return {
            isListed: true,
          }
        },
      })

      expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).not.toBe(null)
      expect(screen.getByText("Listed")).toBeDefined()
    })

    it("display Submission status in REJECTED state ", () => {
      renderWithRelay({
        Artwork: () => {
          return {
            consignmentSubmission: {
              state: "REJECTED",
              stateLabel: "Submission Unsuccessful",
            },
          }
        },
      })

      expect(screen.getByText("Submission Status")).toBeDefined()
      expect(screen.getByText("Submission Unsuccessful")).toBeDefined()
    })
  })
})
