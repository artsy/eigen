import { fireEvent, screen, within } from "@testing-library/react-native"
import { Select } from "app/Components/Select/Select"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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
it("shows title and subtitle within the select", async () => {
  await renderWithWrappers(
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

  await renderWithWrappers(
    <Select
      testID="select"
      title="Title"
      subTitle="Subtitle"
      options={options}
      value="option-1"
      onSelectValue={onSelectValue}
    />
  )

  await fireEvent.press(screen.getByText("Option 1"))

  await flushPromiseQueue()

  await fireEvent.press(screen.getByTestId("select"))

  await flushPromiseQueue()

  const selectModal = within(screen.getByTestId("modal-select"))
  await fireEvent.press(selectModal.getAllByRole("button")[2])
  await flushPromiseQueue()

  expect(onSelectValue).toHaveBeenCalledWith("option-2", 1)
})

it("filters on search", async () => {
  const onSelectValue = jest.fn()

  await renderWithWrappers(
    <Select
      testID="select"
      title="Title"
      subTitle="Subtitle"
      enableSearch
      options={options}
      value="option-1"
      onSelectValue={onSelectValue}
    />
  )

  await fireEvent.press(screen.getByTestId("select"))

  const input = await screen.findByPlaceholderText("Type to search...")

  await fireEvent.changeText(input, "Option 2")

  const selectModal = within(screen.getByTestId("modal-select"))

  expect(selectModal.getByText("Option 2")).toBeOnTheScreen()
})
