import "jest-snapshots-svg"
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

it("Shows 3 sets of questions when there's no edition info", () => {
  const tree = renderer
    .create(<FinalSubmissionQuestions navigator={nav} route={route} setup={{}} submitFinalSubmission={() => ""} />)
    .toJSON()
  expect(tree).toMatchSVGSnapshot(750, 1334)
})

it("Shows 3 sets of questions when there's no edition info on iPad", () => {
  const tree = renderer
    .create(<FinalSubmissionQuestions navigator={nav} route={route} setup={{}} submitFinalSubmission={() => ""} />)
    .toJSON()
  expect(tree).toMatchSVGSnapshot(1536, 2048)
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
  expect(tree).toMatchSVGSnapshot(750, 1334)
})

describe("Updating state", () => {
  it("adds submitted before triggering final submission on submit", () => {
    const submit = jest.fn()

    const f = new FinalSubmissionQuestions({ navigator: nav, route, setup: {}, submitFinalSubmission: submit })
    f.setState = jest.fn()
    f.submitWork()
  })
})
