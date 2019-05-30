import { NativeModules } from "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Header from "../Header"

beforeAll(() => {
  NativeModules.ARTemporaryAPIModule = { followStatusForGene: jest.fn() }
})

it("renders properly", () => {
  const gene = {
    id: "gene-deep-time",
    internalID: "gravity-id",
    gravityID: "deep-time",
    name: "Deep Time",
  }

  const header = renderer.create(<Header gene={gene as any} shortForm={false} />).toJSON()
  expect(header).toMatchSnapshot()
})
