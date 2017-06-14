import * as React from "react"
// import * as ReactTestUtils from "react-dom/test-utils"
import * as renderer from "react-test-renderer"
import * as shallow from "react-test-renderer/shallow"

import * as TODOStories from "../../__stories__/todo.story"
import storyRunner from "./runner"

import TODO from "../artwork_consignment_todo"

storyRunner("TODO states:", TODOStories)

describe("User Interaction", () => {
  // This test is going to end up brittle
  // see: https://github.com/artsy/emission/issues/577

  it.skip("calls goto Artist on to the artist button", () => {
    // const testFunc = jest.fn()
    // const renderer = ReactTestUtils.createRenderer()
    // renderer.render(<TODO goToArtist={testFunc} />)
    // const e = renderer.getRenderOutput()
    // const d = ReactTestUtils.renderIntoDocument(<TODO goToArtist={testFunc} />)
    // const a = ReactTestUtils.findAllInRenderedTree(e, c => true)
    // console.log(a)
    // e.props.children[1].props.onPress()
    // expect(testFunc).toBeCalled()
    // console.log(e.props.children[1])
  })
})
