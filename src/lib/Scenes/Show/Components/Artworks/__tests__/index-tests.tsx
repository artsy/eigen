import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { Artworks } from "../index"

it("looks correct when rendered", () => {
  const data = {
    artworks: [],
    __id: "12345",
    $refType: {},
  }
  const comp = renderer.create(<Artworks show={data as any} />)
  expect(comp).toMatchSnapshot()
})
