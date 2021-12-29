import { act, fireEvent } from "@testing-library/react-native"
import { useFormikContext } from "formik"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Rarity } from "./Rarity"

jest.mock("formik")

describe("RarityPicker", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(() => jest.fn()),
      values: {
        attributionClass: "Limited Edition",
      },
    }))
  })

  it("displays the correct rarity", async () => {
    const { getByText, findByText, getByTestId } = renderWithWrappersTL(<Rarity />)

    act(() => fireEvent.press(getByTestId("rarity-select")))
    await flushPromiseQueue()
    act(() => fireEvent.press(getByText("Limited Edition")))

    expect(findByText("EDITION NUMBER")).toBeTruthy()
  })
})
