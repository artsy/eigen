import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import { AutoStory } from "../../__stories__"

const runTests = (title: string, storybook: AutoStory) => {
  describe(title, () => {
    storybook.allStates.forEach(test => {
      const name = Object.keys(test)[0]
      const state = test[name]

      it(`Looks right when ${name}`, () => {
        const todo = renderer.create(<storybook.component {...state} />)
        expect(todo.toJSON()).toMatchSnapshot()
      })
    })
  })
}

export default runTests
