import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { SavedSearchAlertSwitch, SavedSearchAlertSwitchProps } from "./SavedSearchAlertSwitch"

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

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)

    expect(screen.getByText("Label")).toBeTruthy()
  })

  it("should render active state", () => {
    const { getByA11yState } = renderWithWrappers(<TestRenderer active />)

    expect(getByA11yState({ selected: true })).toBeTruthy()
  })

  it('should call "onChange" handler when the toggle is pressed', () => {
    renderWithWrappers(<TestRenderer />)

    fireEvent(screen.getByLabelText("Label Toggler"), "valueChange", true)

    expect(onChangeMock).toBeCalledWith(true)
  })
})
