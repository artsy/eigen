import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import Text from "../../Components/TextInput"
import Edition from "../Edition"

const nav = {} as any
const route = {} as any

it("renders without throwing an error", () => {
  const tree = renderWithWrappers(<Edition navigator={nav} route={route} setup={{}} updateWithEdition={() => ""} />)
  expect(tree.root.findAllByType(Text)).toHaveLength(0)
})

it("Shows and additional 2 inputs when there's edition info", () => {
  const tree = renderWithWrappers(
    <Edition
      navigator={nav}
      route={route}
      setup={{
        editionInfo: {},
      }}
      updateWithEdition={() => ""}
    />
  )
  expect(tree.root.findAllByType(Text)).toHaveLength(2)
})
