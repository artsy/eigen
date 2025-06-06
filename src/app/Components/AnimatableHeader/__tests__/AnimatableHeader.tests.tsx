import { fireEvent, screen } from "@testing-library/react-native"
import { AnimatableHeader } from "app/Components/AnimatableHeader/AnimatableHeader"
import { AnimatableHeaderProvider } from "app/Components/AnimatableHeader/AnimatableHeaderProvider"
import { AnimatableHeaderScrollView } from "app/Components/AnimatableHeader/AnimatableHeaderScrollView"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { range } from "lodash"
import { Text } from "react-native"

describe("AnimatableHeader", () => {
  const HeaderWrapper = ({ children }: { children: React.ReactNode }) => (
    <AnimatableHeaderProvider>
      {children}
      <AnimatableHeaderScrollView>
        {range(0, 30).map((i) => (
          <Text key={`${i}`}>wow {i}</Text>
        ))}
      </AnimatableHeaderScrollView>
    </AnimatableHeaderProvider>
  )

  it("should render title large title initially", () => {
    renderWithWrappers(
      <HeaderWrapper>
        <AnimatableHeader title="Custom Title" onLeftButtonPress={jest.fn()} />
      </HeaderWrapper>
    )
    expect(screen.getByTestId("animated-header-large-title")).toBeTruthy()
  })

  it("should render passed rightButtonText prop", () => {
    renderWithWrappers(
      <HeaderWrapper>
        <AnimatableHeader
          title="Title"
          onLeftButtonPress={jest.fn()}
          rightButtonText="Custom Right Button Text"
          onRightButtonPress={jest.fn()}
        />
      </HeaderWrapper>
    )

    expect(screen.getByText("Custom Right Button Text")).toBeTruthy()
  })

  it('should hide right button if "onRightButtonPress" is not passed', () => {
    renderWithWrappers(
      <HeaderWrapper>
        <AnimatableHeader
          title="Title"
          onLeftButtonPress={jest.fn()}
          rightButtonText="Custom Right Button Text"
        />
      </HeaderWrapper>
    )

    expect(screen.queryByText("Right Button")).toBeFalsy()
  })

  it('should hide right button if "rightButtonText" is not passed', () => {
    renderWithWrappers(
      <HeaderWrapper>
        <AnimatableHeader title="Title" onLeftButtonPress={jest.fn()} />
      </HeaderWrapper>
    )

    expect(screen.queryByText("Right Button")).toBeFalsy()
  })

  it("should disable right button when rightButtonDisabled prop is true", () => {
    renderWithWrappers(
      <HeaderWrapper>
        <AnimatableHeader
          title="Title"
          onLeftButtonPress={jest.fn()}
          onRightButtonPress={jest.fn()}
          rightButtonText="Custom Right Button Text"
          rightButtonDisabled
        />
      </HeaderWrapper>
    )

    expect(screen.queryByText(/Right Button/)).toBeDisabled()
  })

  it('should call "onLeftButtonPress" handler when back button is pressed', () => {
    const onLeftButtonPressMock = jest.fn()
    renderWithWrappers(
      <HeaderWrapper>
        <AnimatableHeader title="Title" onLeftButtonPress={onLeftButtonPressMock} />
      </HeaderWrapper>
    )

    fireEvent.press(screen.getByLabelText("Header back button"))

    expect(onLeftButtonPressMock).toBeCalled()
  })

  it('should call "onRightButtonPress" handler when right button is pressed', () => {
    const onRightButtonPressMock = jest.fn()
    renderWithWrappers(
      <HeaderWrapper>
        <AnimatableHeader
          title="Title"
          onLeftButtonPress={jest.fn()}
          rightButtonText="Custom Right Button Text"
          onRightButtonPress={onRightButtonPressMock}
        />
      </HeaderWrapper>
    )

    fireEvent.press(screen.getByText(/Right Button/))

    expect(onRightButtonPressMock).toBeCalled()
  })
})
