import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import TabView from "../tab_view"

it("looks like expected", () => {
  const tree = renderer
    .create(
      // tslint:disable-next-line:no-empty
      <TabView titles={["one", "two"]} selectedIndex={1} onSelectionChange={() => {}} />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
