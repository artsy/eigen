import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { InputRef } from "palette/elements/Input/Input"
import { useRef } from "react"
import { SearchInput, SearchInputProps } from "./SearchInput"

describe("SearchInput", () => {
  const onCancelPressMock = jest.fn()

  const TestWrapper = (props: SearchInputProps) => {
    const ref = useRef<InputRef>(null)
    return (
      <SearchInput
        ref={ref}
        onCancelPress={onCancelPressMock}
        placeholder="Type something..."
        {...props}
      />
    )
  }

  it("renders input", async () => {
    renderWithWrappers(<TestWrapper />)
    expect(screen.getByPlaceholderText("Type something...")).toBeDefined()
  })

  it(`doesn't render "Cancel" button when "enableCancelButton" is not passed`, async () => {
    renderWithWrappers(<TestWrapper />)
    expect(screen.queryByText("Cancel")).toBeNull()

    const input = screen.getByPlaceholderText("Type something...")
    fireEvent(input, "focus")
    expect(screen.queryByText("Cancel")).toBeNull()
  })

  it("renders `Cancel` button when `enableCancelButton` is passed", async () => {
    renderWithWrappers(<TestWrapper enableCancelButton />)
    expect(screen.queryByText("Cancel")).toBeNull()

    const input = screen.getByPlaceholderText("Type something...")
    fireEvent(input, "focus")
    await waitFor(() => expect(screen.getByText("Cancel")).toBeTruthy())
  })

  it(`calls passed "onCancelPress" callback and emits "clear" event when pressing on "Cancel" button`, async () => {
    renderWithWrappers(<TestWrapper enableCancelButton />)

    const input = screen.getByPlaceholderText("Type something...")
    fireEvent(input, "focus")
    await waitFor(() => expect(screen.getByText("Cancel")).toBeTruthy())

    fireEvent.press(screen.getByText("Cancel"))

    expect(onCancelPressMock).toHaveBeenCalled()
    expect(screen.queryByText("Cancel")).toBeNull()
  })

  it(`hides "x" button when pressing "Cancel"`, async () => {
    renderWithWrappers(<TestWrapper enableCancelButton />)

    const input = screen.getByPlaceholderText("Type something...")
    fireEvent(input, "focus")
    await waitFor(() => expect(screen.getByText("Cancel")).toBeTruthy())

    fireEvent(input, "changeText", "text")
    expect(screen.getByLabelText("Clear input button")).toBeTruthy()

    fireEvent.press(screen.getByText("Cancel"))
    expect(screen.queryByLabelText("Clear input button")).toBeNull()
  })

  it("should show `Cancel` button on focus, hide button when button pressed", async () => {
    renderWithWrappers(<TestWrapper enableCancelButton />)

    expect(screen.queryByText("Cancel")).toBeNull()

    const input = screen.getByPlaceholderText("Type something...")
    fireEvent(input, "focus")
    fireEvent.changeText(input, "im typing")

    const cancelButton = screen.getByText("Cancel")
    expect(cancelButton).toBeTruthy()

    fireEvent.press(cancelButton)
    expect(screen.queryByText("Cancel")).toBeNull()
  })
})
