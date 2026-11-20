import { fireEvent, screen } from "@testing-library/react-native"
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

  it("renders without throwing an error", async () => {
    await renderWithWrappers(<TestRenderer />)

    expect(screen.getByText("Title")).toBeTruthy()
    expect(screen.getByLabelText("Header back button")).toBeTruthy()
  })

  it('should call "onLeftButtonPress" handler when left button is pressed', async () => {
    const onLeftButtonPressMock = jest.fn()
    await renderWithWrappers(<TestRenderer onLeftButtonPress={onLeftButtonPressMock} />)

    await fireEvent.press(screen.getByLabelText("Header back button"))

    expect(onLeftButtonPressMock).toBeCalled()
  })

  it("should render right button if all required props are passed", async () => {
    await renderWithWrappers(
      <TestRenderer rightButtonText="Right button" onRightButtonPress={jest.fn} />
    )

    expect(screen.getByLabelText("Header right button")).toBeTruthy()
  })

  it('should call "onRightButtonPress" handler when right button is pressed', async () => {
    const onRightButtonPressMock = jest.fn()
    await renderWithWrappers(
      <TestRenderer rightButtonText="Right button" onRightButtonPress={onRightButtonPressMock} />
    )

    await fireEvent.press(screen.getByLabelText("Header right button"))

    expect(onRightButtonPressMock).toBeCalled()
  })
})
