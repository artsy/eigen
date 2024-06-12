import { screen } from "@testing-library/react-native"
import { MyCollectionArtworkSubmissionStatusTestQuery } from "__generated__/MyCollectionArtworkSubmissionStatusTestQuery.graphql"
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
})
