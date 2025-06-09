import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkFilterBackHeader,
  ArtworkFilterBackHeaderProps,
} from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const defaultProps: ArtworkFilterBackHeaderProps = {
  title: "Title",
  onLeftButtonPress: jest.fn,
}

describe("ArtworkFilterBackHeader", () => {
  const TestRenderer = (props?: Partial<ArtworkFilterBackHeaderProps>) => {
    return <ArtworkFilterBackHeader {...defaultProps} {...props} />
  }

  it("renders without throwing an error", () => {
    const { getByText, getByLabelText } = renderWithWrappers(<TestRenderer />)

    expect(getByText("Title")).toBeTruthy()
    expect(getByLabelText("Header back button")).toBeTruthy()
  })

  it('should call "onLeftButtonPress" handler when left button is pressed', () => {
    const onLeftButtonPressMock = jest.fn()
    const { getByLabelText } = renderWithWrappers(
      <TestRenderer onLeftButtonPress={onLeftButtonPressMock} />
    )

    fireEvent.press(getByLabelText("Header back button"))

    expect(onLeftButtonPressMock).toBeCalled()
  })

  it("should render right button if all required props are passed", () => {
    const { getByLabelText } = renderWithWrappers(
      <TestRenderer rightButtonText="Right button" onRightButtonPress={jest.fn} />
    )

    expect(getByLabelText("Header right button")).toBeTruthy()
  })

  it('should call "onRightButtonPress" handler when right button is pressed', () => {
    const onRightButtonPressMock = jest.fn()
    const { getByLabelText } = renderWithWrappers(
      <TestRenderer rightButtonText="Right button" onRightButtonPress={onRightButtonPressMock} />
    )

    fireEvent.press(getByLabelText("Header right button"))

    expect(onRightButtonPressMock).toBeCalled()
  })
})
