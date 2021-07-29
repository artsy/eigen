// @ts-expect-error
import { mount } from "enzyme"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import React from "react"
import { Theme } from "../../../Theme"
import { Button } from "../Button"

describe("Button", () => {
  const getWrapper = (props: any) => {
    return mount(
      <GlobalStoreProvider>
        <Theme>
          <Button {...props}>Hi</Button>
        </Theme>
      </GlobalStoreProvider>
    )
  }

  it("returns variants and sizes", () => {
    const button = getWrapper({
      variant: "primaryBlack",
    })
    expect(button.find("Spinner").length).toBe(0)
    expect((button.find("PureButton").props() as any).variant).toBe("primaryBlack")
  })

  it("shows spinner if loading is true", () => {
    const button = getWrapper({
      loading: true,
    })

    expect(button.find("Spinner").length).toBe(1)
  })

  it("invokes the onClick callback", () => {
    const onPress = jest.fn()

    const button = getWrapper({
      onPress,
    })

    button.find("Button").simulate("click")

    expect(onPress).toHaveBeenCalled()
  })

  it("does not invoke the onClick callback if loading is true", () => {
    const onPress = jest.fn()

    const button = getWrapper({
      onPress,
      loading: true,
    })

    button.find("Button").simulate("click")

    expect(onPress).not.toHaveBeenCalled()
  })

  it("does not invoke the onClick callback if disabled is true", () => {
    const onPress = jest.fn()

    const button = getWrapper({
      onPress,
      disabled: true,
    })

    button.find("Button").simulate("click")

    expect(onPress).not.toHaveBeenCalled()
  })
})
