import { mount } from "enzyme"
import React, { useState } from "react"
import { act } from "react-test-renderer"
import { ModalBase } from "../ModalBase"

const tick = () => new Promise(resolve => setTimeout(resolve, 0))

describe("ModalBase", () => {
  it("renders the children", () => {
    const wrapper = mount(<ModalBase>content</ModalBase>)
    expect(wrapper.html()).toContain("content")
  })

  describe("focus management", () => {
    const Example = () => {
      const [open, setOpen] = useState(true)
      return (
        <>
          <input id="qux" autoFocus />

          <button id="open" onClick={() => setOpen(prevOpen => !prevOpen)}>
            toggle
          </button>

          {open && (
            <ModalBase>
              <input id="foo" />
              <input id="bar" />
              <input id="baz" />
            </ModalBase>
          )}
        </>
      )
    }

    const keydown = async (key: string, shift: boolean) => {
      act(() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key, shiftKey: shift })
        )
      })
      await tick()
    }

    it("focuses the initial input", () => {
      const wrapper = mount(<Example />)
      const input = wrapper.find("#foo")
      expect(input.getElement().props.id).toEqual("foo")
      expect(document.activeElement.id).toEqual("foo")
    })

    it("manages the focus", async () => {
      mount(<Example />)

      // Tabbing through
      expect(document.activeElement.id).toEqual("foo")
      await keydown("Tab", false)
      expect(document.activeElement.id).toEqual("bar")
      await keydown("Tab", false)
      expect(document.activeElement.id).toEqual("baz")
      // Wraps around
      await keydown("Tab", false)
      expect(document.activeElement.id).toEqual("foo")
      // Shift+tab backwards
      await keydown("Tab", true)
      expect(document.activeElement.id).toEqual("baz")
      await keydown("Tab", true)
      expect(document.activeElement.id).toEqual("bar")
      await keydown("Tab", true)
      expect(document.activeElement.id).toEqual("foo")
      await keydown("Tab", true)
      // Wraps around
      expect(document.activeElement.id).toEqual("baz")
    })

    it("returns focus to the previous element when closed", () => {
      const wrapper = mount(<Example />)
      expect(document.activeElement.id).toEqual("foo")
      act(() => wrapper.find("#open").simulate("click"))
      expect(document.activeElement.id).toEqual("qux")
    })
  })
})
