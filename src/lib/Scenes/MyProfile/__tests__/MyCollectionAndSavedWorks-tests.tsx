import { MyCollectionAndSavedWorks_me } from "__generated__/MyCollectionAndSavedWorks_me.graphql"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { FavoriteArtworksQueryRenderer } from "lib/Scenes/Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "lib/Scenes/MyCollection/MyCollection"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { MyCollectionAndSavedWorks, MyProfileHeader, Tab } from "../MyCollectionAndSavedWorks"

jest.mock("../LoggedInUserInfo")
jest.unmock("react-relay")

describe("MyCollectionAndSavedWorks", () => {
  const me = {
    name: "My Name",
    createdAt: new Date().toISOString(),
  }
  const tree = renderWithWrappers(<MyCollectionAndSavedWorks me={me as MyCollectionAndSavedWorks_me} />)
  it("renders without throwing an error", () => {
    renderWithWrappers(<MyCollectionAndSavedWorks me={me as MyCollectionAndSavedWorks_me} />)
  })

  it("renders the right tabs", () => {
    expect(tree.root.findByType(StickyTabPage)).toBeDefined()
    expect(tree.root.findByType(MyCollectionQueryRenderer)).toBeDefined()
    expect(tree.root.findByType(FavoriteArtworksQueryRenderer)).toBeDefined()
  })

  // Header tests
  it("Header Settings onPress navigates to MyProfileSettings", () => {
    tree.root.findByType(FancyModalHeader).props.onRightButtonPress()
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/my-profile/settings")
  })

  it("Header shows the right text", () => {
    const header = tree.root.findByType(MyProfileHeader)
    expect(extractText(header)).toContain(me.name)
    expect(extractText(header)).toContain(`Member since ${new Date(me.createdAt).getFullYear()}`)
  })
})
