import { fireEvent } from "@testing-library/react-native"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Dialog } from "./Dialog"

describe("Dialog", () => {
  it("renders without error", () => {
    const { getByTestId } = renderWithWrappersTL(
      <Dialog
        title="title"
        isVisible
        primaryCta={{
          text: "Primary Action Button",
          onPress: jest.fn(),
        }}
      />
    )

    expect(extractText(getByTestId("dialog-title"))).toBe("title")
  })

  it("should render details if it is passed", () => {
    const { getByTestId } = renderWithWrappersTL(
      <Dialog
        title="title"
        detail="Some unique detail"
        isVisible
        primaryCta={{
          text: "Primary Action Button",
          onPress: jest.fn(),
        }}
      />
    )

    expect(extractText(getByTestId("dialog-detail"))).toBe("Some unique detail")
  })

  it("should render the primary action button", () => {
    const primaryActionMock = jest.fn()

    const { getByTestId } = renderWithWrappersTL(
      <Dialog
        title="title"
        isVisible
        primaryCta={{
          text: "Primary Action Button",
          onPress: primaryActionMock,
        }}
      />
    )
    const primaryButton = getByTestId("dialog-primary-action-button")

    fireEvent.press(primaryButton)

    expect(primaryActionMock).toHaveBeenCalled()
    expect(extractText(primaryButton)).toContain("Primary Action Button")
  })

  it("should render the secondary action button if it is passed", () => {
    const secondaryActionMock = jest.fn()

    const { getByTestId } = renderWithWrappersTL(
      <Dialog
        title="title"
        isVisible
        primaryCta={{
          text: "Primary Action Button",
          onPress: jest.fn(),
        }}
        secondaryCta={{
          text: "Secondary Action Button",
          onPress: secondaryActionMock,
        }}
      />
    )
    const secondaryButton = getByTestId("dialog-secondary-action-button")

    fireEvent.press(secondaryButton)

    expect(secondaryActionMock).toHaveBeenCalled()
    expect(extractText(secondaryButton)).toContain("Secondary Action Button")
  })

  it("should call onBackgroundPress when backdrop is pressed", () => {
    const onBackgroundPressMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <Dialog
        title="title"
        isVisible
        onBackgroundPress={onBackgroundPressMock}
        primaryCta={{
          text: "Primary Action Button",
          onPress: jest.fn(),
        }}
      />
    )

    fireEvent.press(getByTestId("dialog-backdrop"))

    expect(onBackgroundPressMock).toHaveBeenCalled()
  })
})
