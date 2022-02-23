import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { MyCollectionArtworkSubmissionStatus } from "./MyCollectionArtworkSubmissionStatus"

describe("MyCollectionArtworkSubmissionStatus", () => {
  const getWrapper = (displayText?: string) => {
    return renderWithWrappersTL(<MyCollectionArtworkSubmissionStatus displayText={displayText} />)
  }

  it("Displays nothing when displayText is not passed", () => {
    const tree = getWrapper()
    expect(tree.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).toBe(null)
  })

  it("Returns null if the display text is not one of expected status", () => {
    const tree = getWrapper("this is not a status text")
    expect(tree.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).toBe(null)
  })

  it("display Submission status and In Progress when submission is in progress", () => {
    const tree = getWrapper("Submission in progress")
    expect(tree.getByText("Submission Status")).toBeDefined()
    expect(tree.getByText("In Progress")).toBeDefined()
  })

  it("display Submission status and Evaluation Complete when submission has been evaluated", () => {
    const tree = getWrapper("Submission evaluated")
    expect(tree.getByText("Submission Status")).toBeDefined()
    expect(tree.getByText("Evaluation Complete")).toBeDefined()
  })
})
