import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { act } from "react-test-renderer"
import { Navigator } from "../Navigator"

describe("Navigator", () => {
  it("calls the addNavigator action with navigator instance on mount", (done) => {
    renderWithWrappers(<Navigator name="modal" />)
    act(() => {
      setImmediate(() => {
        expect(
          __appStoreTestUtils__?.getCurrentState().myCollection.navigation.sessionState.navigators.modal
        ).toBeDefined()
        done()
      })
    })
  })

  it("renders child component", () => {
    const Noop: React.FC = () => null
    const wrapper = renderWithWrappers(
      <Navigator name="modal">
        <Noop />
      </Navigator>
    )
    expect(wrapper.root.findByType(Noop)).toBeDefined()
  })
})
