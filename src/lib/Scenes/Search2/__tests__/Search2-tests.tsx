import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Search2 } from "../Search2"

describe("Search2 Screen", () => {
  it("should render a text input with placeholder", () => {
    const { getByPlaceholderText } = renderWithWrappersTL(<Search2 system={null} />)

    const searchInput = getByPlaceholderText("Search artists")
    expect(searchInput).toBeTruthy()

    fireEvent.changeText(searchInput, "Banksy")

    expect(searchInput.props.value).toBe("Banksy")
  })
})
