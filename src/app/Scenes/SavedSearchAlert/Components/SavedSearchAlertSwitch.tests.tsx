import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { SavedSearchAlertSwitch, SavedSearchAlertSwitchProps } from "./SavedSearchAlertSwitch"

describe("SavedSearchAlertSwitch", () => {
  const onChangeMock = jest.fn()

  const TestRenderer = (props: Partial<SavedSearchAlertSwitchProps>) => {
    return (
      <SavedSearchAlertSwitch onChange={onChangeMock} active={false} label="Label" {...props} />
    )
  }

  afterEach(() => {
    onChangeMock.mockClear()
  })

  it("renders without throwing an error", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    expect(getByText("Label")).toBeTruthy()
  })

  it("should render active state", () => {
    const { getByA11yState } = renderWithWrappersTL(<TestRenderer active />)

    expect(getByA11yState({ selected: true })).toBeTruthy()
  })

  it('should call "onChange" handler when the toggle is pressed', () => {
    const { getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    fireEvent(getByLabelText("Label Toggler"), "valueChange", true)

    expect(onChangeMock).toBeCalledWith(true)
  })
})
