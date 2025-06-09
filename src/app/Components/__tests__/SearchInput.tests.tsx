import { screen } from "@testing-library/react-native"
import { InputRef } from "app/Components/Input"
import { SearchInput, SearchInputProps } from "app/Components/SearchInput"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useRef } from "react"

describe("SearchInput", () => {
  const TestWrapper = (props: SearchInputProps) => {
    const ref = useRef<InputRef>(null)
    return <SearchInput ref={ref} placeholder="Type something..." {...props} />
  }

  it("renders input", async () => {
    renderWithWrappers(<TestWrapper />)
    expect(screen.getByPlaceholderText("Type something...")).toBeDefined()
  })
})
