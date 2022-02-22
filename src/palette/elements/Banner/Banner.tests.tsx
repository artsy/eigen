import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Banner } from "./Banner"

describe("Banner", () => {
  it("it renders", () => {
    const BannerComponent = renderWithWrappersTL(<Banner title="title" text="text" />)

    expect(BannerComponent).toBeTruthy()

    expect(BannerComponent.getByText("title")).toBeDefined()
    expect(BannerComponent.getByText("text")).toBeDefined()
  })

  it("does not show close button when !showCloseButton", () => {
    const { getByTestId } = renderWithWrappersTL(<Banner title="title" text="text" />)
    expect(() => getByTestId("banner-close-button")).toThrow(
      "Unable to find an element with testID: banner-close-button"
    )
  })

  it("shows close button when showCloseButton", () => {
    const { getByTestId } = renderWithWrappersTL(
      <Banner title="title" text="text" showCloseButton />
    )
    expect(getByTestId("banner-close-button")).toBeDefined()
  })

  it("fires onClose press event", () => {
    const onClose = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <Banner onClose={onClose} title="title" text="text" showCloseButton />
    )
    fireEvent.press(getByTestId("banner-close-button"))
    expect(onClose).toHaveBeenCalled()
  })
})
