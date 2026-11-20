import { fireEvent, screen } from "@testing-library/react-native"
import {
  SavedSearchAlertSwitch,
  SavedSearchAlertSwitchProps,
} from "app/Scenes/SavedSearchAlert/Components/SavedSearchAlertSwitch"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SavedSearchAlertSwitch", () => {
  const onChangeMock = jest.fn()

  const TestRenderer = (props: Partial<SavedSearchAlertSwitchProps>) => {
    return (
      <SavedSearchAlertSwitch onChange={onChangeMock} active={false} label="Label" {...props} />
    )
  }

  afterEach(() => {
    onChangeMock.mockClear()
  })

  it("renders without throwing an error", async () => {
    await renderWithWrappers(<TestRenderer />)

    expect(screen.getByText("Label")).toBeTruthy()
  })

  it("should render active state", async () => {
    await renderWithWrappers(<TestRenderer active />)

    expect(screen.getByLabelText("Label Toggler")).toBeOnTheScreen()
    expect(screen.getByLabelText("Label Toggler")).toBeSelected()
  })

  it('should call "onChange" handler when the toggle is pressed', async () => {
    await renderWithWrappers(<TestRenderer />)

    await fireEvent(screen.getByLabelText("Label Toggler"), "valueChange", true)

    expect(onChangeMock).toBeCalledWith(true)
  })
})
