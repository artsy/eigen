import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { AddEditArtwork } from "lib/Scenes/MyCollection/Screens/AddArtwork/AddEditArtwork"
import { __appStoreTestUtils__, AppStore } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { act } from "react-test-renderer"
import { Modal } from "../Modal"

jest.mock("lib/Scenes/MyCollection/Screens/AddArtwork/AddEditArtwork", () => ({
  AddEditArtwork: () => null,
}))

describe("Modal", () => {
  it("injects correct navigator", (done) => {
    __appStoreTestUtils__?.injectState({ myCollection: { navigation: { sessionState: { modalType: "add" } } } })
    renderWithWrappers(<Modal />)
    act(() => {
      setImmediate(() => {
        expect(
          __appStoreTestUtils__?.getCurrentState().myCollection.navigation.sessionState.navigators.modal
        ).toBeDefined()
        done()
      })
    })
  })

  it("renders AddEditArtwork component with visible=true", () => {
    __appStoreTestUtils__?.injectState({ myCollection: { navigation: { sessionState: { modalType: "add" } } } })
    const wrapper = renderWithWrappers(<Modal />)
    expect(wrapper.root.findAllByType(AddEditArtwork)).toBeDefined()
  })

  it("calls cancelAddEditArtwork on background click", () => {
    const spy = jest.fn()
    AppStore.actions.myCollection.artwork.cancelAddEditArtwork = spy as any
    __appStoreTestUtils__?.injectState({ myCollection: { navigation: { sessionState: { modalType: "add" } } } })
    const wrapper = renderWithWrappers(<Modal />)
    wrapper.root.findByType(FancyModal).props.onBackgroundPressed()
    expect(spy).toHaveBeenCalled()
  })
})
