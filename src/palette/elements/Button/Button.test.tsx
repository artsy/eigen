import { mount } from "enzyme"
import React from "react"
import styled from "styled-components"
import { Theme } from "../../Theme"
import { Button } from "../Button"

describe("Button", () => {
  it("returns variants and sizes", () => {
    const getWrapper = props => {
      return mount(
        <Theme>
          <Button {...props}>Hi</Button>
        </Theme>
      )
    }

    let button = getWrapper({
      variant: "primaryBlack",
    })
    expect(button.find("Spinner").length).toBe(0)
    expect((button.find("ButtonBase").props() as any).variant).toBe(
      "primaryBlack"
    )

    button = getWrapper({
      variant: "primaryWhite",
    })
    expect((button.find("ButtonBase").props() as any).variant).toBe(
      "primaryWhite"
    )

    button = getWrapper({
      size: "small",
    })
    expect((button.find("ButtonBase").props() as any).size).toBe("2")

    button = getWrapper({
      size: "medium",
    })
    expect((button.find("ButtonBase").props() as any).size).toBe("3t")

    button = getWrapper({
      size: "large",
    })
    expect((button.find("ButtonBase").props() as any).size).toBe("3t")
  })

  it("shows spinner if loading is true", () => {
    const wrapper = mount(
      <Theme>
        <Button loading>Hi</Button>
      </Theme>
    )
    expect(wrapper.find("Spinner").length).toBe(1)
    expect(wrapper.html()).toContain('class="loading')
  })

  it("does not invoke the onClick callback if loading is true", () => {
    const onClickMock = jest.fn()

    const wrapper = mount(
      <Theme>
        <Button onClick={onClickMock} loading>
          Hi
        </Button>
      </Theme>
    )

    wrapper.find("Button").simulate("click")

    expect(onClickMock).not.toHaveBeenCalled()
  })

  it("passes the `disabled` prop down to the DOM element", () => {
    const wrapper = mount(
      <Theme>
        <>
          <Button>Good</Button>
          <Button disabled>No good</Button>
        </>
      </Theme>
    )

    expect(wrapper.find("button[disabled]")).toHaveLength(1)
  })

  it("has the styled-components classes on styled(Button)", () => {
    const StyledButton = styled(Button)`
      border: 1px solid red;
    `

    const wrapper = mount(<StyledButton>styled</StyledButton>)

    expect(wrapper.html()).toContain("Buttontest__StyledButton")
  })
})
