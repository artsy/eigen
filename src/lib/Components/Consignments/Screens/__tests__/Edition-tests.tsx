import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Text from "../../Components/TextInput"
import Edition from "../Edition"

import { Theme } from "@artsy/palette"

const nav = {} as any
const route = {} as any

it("renders without throwing an error", () => {
  const tree = renderer.create(
    <Theme>
      <Edition navigator={nav} route={route} setup={{}} updateWithEdition={() => ""} />
    </Theme>
  )
  expect(tree.root.findAllByType(Text)).toHaveLength(0)
})

it("Shows and additional 2 inputs when there's edition info", () => {
  const tree = renderer.create(
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
  expect(tree.root.findAllByType(Text)).toHaveLength(2)
})
