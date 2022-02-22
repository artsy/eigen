import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { PillType } from "../types"
import { SearchPills, SearchPillsProps } from "./SearchPills"

const pills: PillType[] = [
  {
    indexName: "first",
    displayName: "First",
    type: "algolia",
    disabled: false,
    key: "first",
  },
  {
    indexName: "second",
    displayName: "Second",
    type: "algolia",
    disabled: false,
    key: "second",
  },
  {
    indexName: "third",
    displayName: "Third",
    type: "algolia",
    disabled: false,
    key: "third",
  },
]

describe("SearchPills", () => {
  const mockRef = jest.fn()
  const TestRenderer = (props: Partial<SearchPillsProps>) => {
    return (
      <SearchPills
        ref={mockRef}
        loading={false}
        pills={pills}
        onPillPress={jest.fn}
        isSelected={() => false}
        {...props}
      />
    )
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
      indexName: "second",
      displayName: "Second",
      key: "second",
      disabled: false,
    })
  })

  it("the selected pill must be displayed correctly", () => {
    const isSelected = (pill: PillType) => pill.key === "second"
    const { getByA11yState } = renderWithWrappersTL(<TestRenderer isSelected={isSelected} />)

    expect(getByA11yState({ selected: true })).toHaveTextContent("Second")
  })
})
