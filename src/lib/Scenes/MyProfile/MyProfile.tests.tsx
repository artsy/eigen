import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { MyCollectionAndSavedWorksQueryRenderer } from "./MyCollectionAndSavedWorks"
import { MyProfileQueryRenderer } from "./MyProfile"

jest.mock("./LoggedInUserInfo")
jest.unmock("react-relay")

describe(MyProfileQueryRenderer, () => {
  const getWrapper = () => {
    const tree = renderWithWrappers(<MyProfileQueryRenderer />)

    return tree
  }
  it("Loads MyCollectionAndSavedArtworks Screen", () => {
    const tree = getWrapper()
    expect(tree.root.findAllByType(MyCollectionAndSavedWorksQueryRenderer)).toHaveLength(1)
  })
})
