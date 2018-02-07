import { NativeModules } from "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Header from "../Header"

beforeAll(() => {
  NativeModules.ARTemporaryAPIModule = { followStatusForGene: jest.fn() }
})

it("renders properly", () => {
  const gene = {
    __id: "gene-deep-time",
    _id: "gravity-id",
    id: "deep-time",
    name: "Deep Time",
  }

  const header = renderer.create(<Header gene={gene} shortForm={false} />).toJSON()
  expect(header).toMatchSnapshot()
})
