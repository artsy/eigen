import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Edition from "../Edition"

import { Theme } from "@artsy/palette"

const nav = {} as any
const route = {} as any

it("Sets up the right view hierarchy", () => {
  const tree = renderer
    .create(
      <Theme>
        <Edition navigator={nav} route={route} setup={{}} updateWithEdition={() => ""} />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it("Shows and additional 2 inputs when there's edition info", () => {
  const tree = renderer
    .create(
      <Theme>
        <Edition
          navigator={nav}
          route={route}
          setup={{
            editionInfo: {},
          }}
          updateWithEdition={() => ""}
        />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
