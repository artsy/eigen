import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import FinalSubmissionQuestions from "../FinalSubmissionQuestions"

const nav = {} as any
const route = {} as any

it("Sets up the right view hierarchy", () => {
  const tree = renderer
    .create(<FinalSubmissionQuestions navigator={nav} route={route} setup={{}} submitFinalSubmission={() => ""} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it("Shows and additional 2 inputs when there's edition info", () => {
  const tree = renderer
    .create(
      <FinalSubmissionQuestions
        navigator={nav}
        route={route}
        setup={{ editionInfo: {} }}
        submitFinalSubmission={() => ""}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

describe("Updating state", () => {
  it("adds submitted before triggering final submission on submit", () => {
    const submit = jest.fn()

    const f = new FinalSubmissionQuestions({ navigator: nav, route, setup: {}, submitFinalSubmission: submit })
    f.setState = jest.fn()
    f.submitWork()
  })
})
