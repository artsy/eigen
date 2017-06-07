import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import { allStates } from "../../__stories__/consignments-search.story"

import Search from "../artist-search-results"

describe("For different states", () => {
  allStates.forEach(test => {
    const name = Object.keys(test)[0]
    const state = test[name]
    it(`Looks right when ${name}`, () => {
      const todo = renderer.create(<Search {...state} />)
      expect(todo.toJSON()).toMatchSnapshot()
    })
  })
})
