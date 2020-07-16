import Spinner from "lib/Components/Spinner"
import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { LoadingScreen } from "../LoadingScreen"

describe(LoadingScreen, () => {
  const TestRenderer = () => <LoadingScreen />

  it("renders a spinner", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)
  })
})
