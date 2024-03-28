import { screen } from "@testing-library/react-native"
import { InputRef } from "app/Components/Input"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useRef } from "react"
import { SearchInput, SearchInputProps } from "./SearchInput"

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
