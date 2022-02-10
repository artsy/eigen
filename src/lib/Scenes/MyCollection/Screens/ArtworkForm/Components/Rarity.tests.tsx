import { act, fireEvent } from "@testing-library/react-native"
import { useFormikContext } from "formik"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Rarity } from "./Rarity"

jest.mock("formik")

describe("Rarity", () => {
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
    await flushPromiseQueue()

    expect(findByText("EDITION NUMBER")).toBeTruthy()
  })

  it("displays the modal with all classification types", async () => {
    const { getByText } = renderWithWrappersTL(<Rarity />)

    act(() => fireEvent.press(getByText("What is this?")))
    await flushPromiseQueue()

    expect(getByText("Unique")).toBeTruthy()
    expect(getByText("Limited Edition")).toBeTruthy()
    expect(getByText("Open Edition")).toBeTruthy()
    expect(getByText("Unknown Edition")).toBeTruthy()
  })
})
