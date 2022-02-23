jest.mock("app/utils/googleMaps", () => ({ getLocationPredictions: jest.fn() }))
import { extractText } from "app/tests/extractText"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { getLocationPredictions, SimpleLocation } from "app/utils/googleMaps"
import { Input, Touchable } from "palette"
import React from "react"
import { ReactTestRenderer } from "react-test-renderer"
import { press, typeInInput } from "./helpers"
import { LocationAutocomplete, LocationPredictions } from "./LocationAutocomplete"

const mockOnChange = jest.fn()
const getWrapper = (initialLocation: SimpleLocation | null = null) =>
  renderWithWrappers(
    <LocationAutocomplete initialLocation={initialLocation} onChange={mockOnChange} />
  )

const locationQueryResult = [
  { id: "a", name: "Busytown, USA" },
  { id: "b", name: "Hello, USA" },
]

describe("<LocationAutocomplete/>", () => {
  let wrapper: ReactTestRenderer

  it("pre-fills the input with an initialLocation prop", async () => {
    wrapper = getWrapper({ id: "1234", name: "Anytown, USA" })
    expect(wrapper.root.findByType(Input).props.value).toEqual("Anytown, USA")
  })

  describe("no preselected location", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue(locationQueryResult)
      wrapper = getWrapper()
    })

    it("queries google when the user types 3 or more characters", async () => {
      await typeInInput(wrapper.root, "h")

      expect(getLocationPredictions).not.toHaveBeenCalled()
      expect(wrapper.root.findAllByProps({ testID: "dropdown" }).length).toEqual(0)

      await typeInInput(wrapper.root, "he")

      expect(getLocationPredictions).not.toHaveBeenCalled()
      expect(wrapper.root.findAllByProps({ testID: "dropdown" }).length).toEqual(0)

      await typeInInput(wrapper.root, "hel")

      expect(getLocationPredictions).toHaveBeenCalled()
      expect(wrapper.root.findAllByProps({ testID: "dropdown" }).length).not.toEqual(0)
      const text = extractText(wrapper.root)
      expect(text).toContain("Busytown, USA")
      expect(text).toContain("Hello, USA")
    })
  })

  it("calls the onChange prop and clears the predictions when the user selects a location", async () => {
    await typeInInput(wrapper.root, "hel")
    await press(wrapper.root, { text: "Busytown, USA", componentType: Touchable })

    expect(mockOnChange).toHaveBeenCalledWith({ id: "a", name: "Busytown, USA" })
    expect(wrapper.root.findByType(Input).props.value).toMatch("Busytown, USA")
    expect(wrapper.root.findAllByProps({ testID: "dropdown" }).length).toEqual(0)
  })

  it("hides the predictions when the user un-focuses the input", async () => {
    await typeInInput(wrapper.root, "Hel")
    wrapper.root.findByType(LocationPredictions).props.onOutsidePress()
    await flushPromiseQueue()

    expect(wrapper.root.findAllByProps({ testID: "dropdown" }).length).toEqual(0)
  })

  it("Highlights matched text in the autocomplete", async () => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([{ id: "x", name: "Hello, World" }])
    await typeInInput(wrapper.root, "hell World")

    expect(extractText(wrapper.root)).toContain("Hello, World")
    expect(wrapper.root.findAllByProps({ fontWeight: "bold" }).map((t) => extractText(t))).toEqual(
      expect.arrayContaining(["Hell", "World"])
    )
  })
})
