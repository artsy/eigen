import { FormikProvider } from "formik"
import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { View } from "react-native"
import { setupMyCollectionScreen } from "../Boot"
import { Navigator } from "../Components/Navigator"

describe("Boot", () => {
  const Noop = () => <View />

  it("initializes with correct wrappers", () => {
    const wrapper = renderWithWrappers(setupMyCollectionScreen(Noop)(null))
    expect(wrapper.root.findAllByType(FormikProvider))
    expect(wrapper.root.findAllByType(Navigator))
    expect(wrapper.root.findAllByType(Noop))
  })

  it("initializes app navigation requirements", () => {
    renderWithWrappers(setupMyCollectionScreen(Noop)(null))
    expect(__appStoreTestUtils__?.getCurrentState().myCollection.navigation.sessionState.navViewRef).toBeDefined()
    expect(__appStoreTestUtils__?.getCurrentState().myCollection.navigation.sessionState.navigators.main).toBeDefined()
  })
})
