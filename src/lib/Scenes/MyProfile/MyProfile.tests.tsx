import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Platform } from "react-native"
import { MyCollectionAndSavedWorksQueryRenderer } from "./MyCollectionAndSavedWorks"
import { MyProfile, MyProfileQueryRenderer, OldMyProfileQueryRenderer } from "./MyProfile"

jest.mock("./LoggedInUserInfo")
jest.unmock("react-relay")

describe(MyProfile, () => {
  const getWrapper = () => {
    const tree = renderWithWrappers(<MyProfileQueryRenderer />)

    return tree
  }

  describe("on iOS", () => {
    beforeEach(() => {
      Platform.OS = "ios"
    })

    it("Loads MyCollectionAndSavedArtworks Screen when AREnableMyCollectionIOS is enabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionIOS: true })
      const tree = getWrapper()
      expect(tree.root.findAllByType(MyCollectionAndSavedWorksQueryRenderer)).toHaveLength(1)
      expect(tree.root.findAllByType(OldMyProfileQueryRenderer)).toHaveLength(0)
    })

    it("Loads OldMyProfileQueryRenderer Screen when AREnableMyCollectionIOS is disabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionIOS: false })
      const tree = getWrapper()
      expect(tree.root.findAllByType(MyCollectionAndSavedWorksQueryRenderer)).toHaveLength(0)
      expect(tree.root.findAllByType(OldMyProfileQueryRenderer)).toHaveLength(1)
    })
  })

  describe("android", () => {
    beforeEach(() => {
      Platform.OS = "android"
    })

    it("Loads OldMyProfileQueryRenderer Screen when AREnableMyCollectionIOS is enabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionIOS: false })
      const tree = getWrapper()
      expect(tree.root.findAllByType(MyCollectionAndSavedWorksQueryRenderer)).toHaveLength(0)
      expect(tree.root.findAllByType(OldMyProfileQueryRenderer)).toHaveLength(1)
    })

    it("Loads OldMyProfileQueryRenderer Screen when AREnableMyCollectionIOS is disabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionIOS: false })
      const tree = getWrapper()
      expect(tree.root.findAllByType(MyCollectionAndSavedWorksQueryRenderer)).toHaveLength(0)
      expect(tree.root.findAllByType(OldMyProfileQueryRenderer)).toHaveLength(1)
    })
  })
})
