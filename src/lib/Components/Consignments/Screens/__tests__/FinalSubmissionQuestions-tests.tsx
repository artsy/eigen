import "jest-snapshots-svg"
import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import FinalSubmissionQuestions from "../FinalSubmissionQuestions"

const nav = {} as any
const route = {} as any

it("Sets up the right view hierarchy", () => {
  const tree = renderer.create(<FinalSubmissionQuestions navigator={nav} route={route} setup={{}} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it("Shows 3 sets of questions when there's no edition info", () => {
  const tree = renderer.create(<FinalSubmissionQuestions navigator={nav} route={route} setup={{}} />).toJSON()
  expect(tree).toMatchSVGSnapshot(750, 1334)
})

it("Shows and additional 2 inputs when there's edition info", () => {
  const tree = renderer
    .create(<FinalSubmissionQuestions navigator={nav} route={route} setup={{ editionInfo: {} }} />)
    .toJSON()
  expect(tree).toMatchSVGSnapshot(750, 1334)
})
