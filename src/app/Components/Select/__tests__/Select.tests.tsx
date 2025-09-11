import { Input, Text, Touchable } from "@artsy/palette-mobile"
import { act, fireEvent, screen } from "@testing-library/react-native"
import { Select } from "app/Components/Select/Select"
import { extractText } from "app/utils/tests/extractText"
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

  expect(onSelectValue).toHaveBeenCalledWith("option-1", 1)
  screen.debug()

  // // // eslint-disable-next-line testing-library/await-async-queries
  // // const selectModal = view.root.findAllByType(Modal)[0]
  // // // eslint-disable-next-line testing-library/await-async-queries
  // // selectModal.findAllByType(Touchable)[1].props.onPress()
})

xit("filters on search", async () => {
  const onSelectValue = jest.fn()

  const view = renderWithWrappers(
    <Select
      title="Title"
      subTitle="Subtitle"
      enableSearch
      options={options}
      value="option-1"
      onSelectValue={onSelectValue}
    />
  )

  // eslint-disable-next-line testing-library/await-async-queries
  await act(() => view.root.findAllByType(Touchable)[0].props.onPress())

  await flushPromiseQueue()

  // eslint-disable-next-line testing-library/await-async-queries
  const input = view.root.findAllByType(Input)[0]

  input.props.onChangeText("Option 2")

  // eslint-disable-next-line testing-library/await-async-queries
  const selectModal = view.root.findAllByType(Modal)[0]

  // eslint-disable-next-line testing-library/await-async-queries
  expect(selectModal.findAllByType(Touchable).length).toEqual(1)
  // eslint-disable-next-line testing-library/await-async-queries
  expect(extractText(selectModal.findAllByType(Touchable)[0].findAllByType(Text)[0])).toEqual(
    "Option 2"
  )
})
