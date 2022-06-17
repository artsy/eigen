import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { SortByModal, SortByModalProps, SortOption } from "./SortByModal"

describe("SortByModal", () => {
  const TestRenderer = (props: Partial<SortByModalProps>) => {
    return (
      <SortByModal
        visible
        options={options}
        selectedValue="OPTION_ONE"
        onCloseModal={jest.fn}
        onModalFinishedClosing={jest.fn}
        onSelectOption={jest.fn}
        {...props}
      />
    )
  }

  it("should render options", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    expect(getByText("Option One")).toBeTruthy()
    expect(getByText("Option Two")).toBeTruthy()
  })

  it("should call `onSelectOption` with selected option", () => {
    const mockOnSelectOption = jest.fn()
    const { getByText } = renderWithWrappersTL(<TestRenderer onSelectOption={mockOnSelectOption} />)

    fireEvent.press(getByText("Option Two"))

    expect(mockOnSelectOption.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "text": "Option Two",
          "value": "OPTION_TWO",
        },
      ]
    `)
  })

  it("should render selected option state when `selectedValue` prop is passed", () => {
    const { getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)
    const selectedOptions = getAllByA11yState({ selected: true })

    expect(selectedOptions).toHaveLength(1)
    expect(selectedOptions[0]).toHaveTextContent("Option One")
  })
})

const options: SortOption[] = [
  { value: "OPTION_ONE", text: "Option One" },
  { value: "OPTION_TWO", text: "Option Two" },
]
