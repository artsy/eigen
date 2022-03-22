import { renderWithWrappers } from "app/tests/renderWithWrappers"
import "react-native"

import Text from "../Components/TextInput"
import Edition from "./Edition"

const nav = {} as any

it("renders without throwing an error", () => {
  const tree = renderWithWrappers(
    <Edition navigator={nav} setup={{}} updateWithEdition={() => ""} />
  )
  expect(tree.root.findAllByType(Text)).toHaveLength(0)
})

it("Shows and additional 2 inputs when there's edition info", () => {
  const tree = renderWithWrappers(
    <Edition
      navigator={nav}
      setup={{
        editionInfo: {},
      }}
      updateWithEdition={() => ""}
    />
  )
  expect(tree.root.findAllByType(Text)).toHaveLength(2)
})
