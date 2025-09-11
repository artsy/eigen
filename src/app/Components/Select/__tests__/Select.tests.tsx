import { Input, Touchable } from "@artsy/palette-mobile"
import { fireEvent, screen, within } from "@testing-library/react-native"
import { Select } from "app/Components/Select/Select"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Modal } from "react-native"

jest.mock("react-native/Libraries/Interaction/InteractionManager", () => ({
  ...jest.requireActual("react-native/Libraries/Interaction/InteractionManager"),
  runAfterInteractions: jest.fn((callback) => callback()),
}))

const options = [
  {
    label: "Option 1",
    value: "option-1",
    searchTerms: ["Option 1"],
  },
  {
    label: "Option 2",
    value: "option-2",
    searchTerms: ["Option 2"],
  },
]
it("shows title and subtitle within the select", () => {
  renderWithWrappers(
    <Select
      title="Title"
      subTitle="Subtitle"
      options={options}
      value="option-1"
      onSelectValue={() => null}
    />
  )

  expect(screen.getByText("Title")).toBeOnTheScreen()
  expect(screen.getByText("Option 1")).toBeOnTheScreen()
})

it("selects correct value", async () => {
  const onSelectValue = jest.fn()

  renderWithWrappers(
    <Select
      title="Title"
      subTitle="Subtitle"
      options={options}
      value="option-1"
      onSelectValue={onSelectValue}
    />
  )

  fireEvent.press(screen.getByText("Option 1"))

  await flushPromiseQueue()

  fireEvent.press(screen.UNSAFE_getAllByType(Touchable)[0])

  await flushPromiseQueue()

  const selectModal = screen.UNSAFE_getAllByType(Modal)[0]
  // eslint-disable-next-line testing-library/await-async-queries
  await selectModal.findAllByType(Touchable)[1].props.onPress()

  expect(onSelectValue).toHaveBeenCalledWith("option-2", 1)
})

it("filters on search", async () => {
  const onSelectValue = jest.fn()

  renderWithWrappers(
    <Select
      title="Title"
      subTitle="Subtitle"
      enableSearch
      options={options}
      value="option-1"
      onSelectValue={onSelectValue}
    />
  )

  fireEvent.press(screen.UNSAFE_getAllByType(Touchable)[0])

  await flushPromiseQueue()

  const input = screen.UNSAFE_getAllByType(Input)[0]

  fireEvent.changeText(input, "Option 2")

  const selectModal = within(screen.UNSAFE_getAllByType(Modal)[0])

  expect(selectModal.getByText("Option 2")).toBeOnTheScreen()
})
