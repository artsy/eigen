import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import { allStates } from "../../__stories__/consignments-todo.story"

import TODO from "../artwork-consignment-todo"

describe("For different states", () => {
  for (const key in allStates) {
    if (allStates.hasOwnProperty(key)) {
      const state = allStates[key]
      it(`Looks right ${key}`, () => {
        const todo = renderer.create(<TODO {...state} />)
        expect(todo.toJSON()).toMatchSnapshot()
      })
    }
  }
})
