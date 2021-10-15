import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { SearchPills, SearchPillsProps } from "../components/SearchPills"
import { PillType } from "../types"

const pills: PillType[] = [
  {
    name: "first",
    displayName: "First",
    type: "algolia",
  },
  {
    name: "second",
    displayName: "Second",
    type: "algolia",
  },
  {
    name: "third",
    displayName: "Third",
    type: "algolia",
  },
]

describe("SearchPills", () => {
  const mockRef = jest.fn()
  const TestRenderer = (props: Partial<SearchPillsProps>) => {
    return <SearchPills ref={mockRef} pills={pills} onPillPress={jest.fn} isSelected={() => false} {...props} />
  }

  it("renders without throwing an error", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    expect(getByText("First")).toBeTruthy()
    expect(getByText("Second")).toBeTruthy()
    expect(getByText("Third")).toBeTruthy()
  })

  it('should call "onPillPress" handler when the pill is pressed', () => {
    const onPillPressMock = jest.fn()
    const { getByText } = renderWithWrappersTL(<TestRenderer onPillPress={onPillPressMock} />)

    fireEvent.press(getByText("Second"))

    expect(onPillPressMock).toBeCalledWith({
      type: "algolia",
      name: "second",
      displayName: "Second",
    })
  })

  it("the selected pill must be displayed correctly", () => {
    const isSelected = (pill: PillType) => pill.name === "second"
    const { getByA11yState } = renderWithWrappersTL(<TestRenderer isSelected={isSelected} />)

    expect(getByA11yState({ selected: true })).toHaveTextContent("Second")
  })
})
