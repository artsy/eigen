import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Edition from "../Edition"

const nav = {} as any
const route = {} as any

it("Sets up the right view hierarchy", () => {
  const tree = renderer
    .create(<Edition navigator={nav} route={route} setup={{}} updateWithEdition={() => ""} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it("Shows and additional 2 inputs when there's edition info", () => {
  const tree = renderer
    .create(<Edition navigator={nav} route={route} setup={{ editionInfo: {} }} updateWithEdition={() => ""} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
