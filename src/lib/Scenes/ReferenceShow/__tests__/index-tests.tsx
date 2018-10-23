import React from "react"
import * as renderer from "react-test-renderer"
import Show from "../"

it("Renders a show", () => {
  // TODO: use mocked resolver
  const show = {
    shows: [],
    artworks: [],
    artists: [],
    location: {},
  }
  const comp = renderer.create(<Show show={show as any} />)
  expect(comp).toMatchSnapshot()
})
