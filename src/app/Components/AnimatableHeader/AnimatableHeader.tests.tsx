import { fireEvent, screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { range } from "lodash"
import { Text } from "react-native"
import { AnimatableHeader } from "./AnimatableHeader"
import { AnimatableHeaderProvider } from "./AnimatableHeaderProvider"
import { AnimatableHeaderScrollView } from "./AnimatableHeaderScrollView"
import { withReanimatedTimer } from "react-native-reanimated/src/reanimated2/jestUtils"

describe("AnimatableHeader", () => {
  const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <AnimatableHeaderProvider>
        {children}
        <AnimatableHeaderScrollView>
          {range(0, 30).map((i) => (
            <Text>wow {i}</Text>
          ))}
        </AnimatableHeaderScrollView>
      </AnimatableHeaderProvider>
    )
  }

  it("should render title large title initially", () => {
    withReanimatedTimer(() => {
      renderWithWrappersTL(
        <AnimatableHeader title="Custom Title" onLeftButtonPress={jest.fn()} />,
        HeaderWrapper
      )

      expect(screen.getByTestId("animated-header-large-title")).toBeTruthy()
    })
  })

  it("should render passed rightButtonText prop", () => {
    withReanimatedTimer(() => {
      renderWithWrappersTL(
        <AnimatableHeader
          title="Title"
          onLeftButtonPress={jest.fn()}
          rightButtonText="Custom Right Button Text"
          onRightButtonPress={jest.fn()}
        />,
        HeaderWrapper
      )

      expect(screen.getByText("Custom Right Button Text")).toBeTruthy()
    })
  })

  it('should hide right button if "onRightButtonPress" is not passed', () => {
    withReanimatedTimer(() => {
      renderWithWrappersTL(
        <AnimatableHeader
          title="Title"
          onLeftButtonPress={jest.fn()}
          rightButtonText="Custom Right Button Text"
        />,
        HeaderWrapper
      )

      expect(screen.queryByText("Right Button")).toBeFalsy()
    })
  })

  it('should hide right button if "rightButtonText" is not passed', () => {
    const { queryByText } = renderWithWrappersTL(
      <TestWrapper onRightButtonPress={jest.fn} rightButtonText={undefined} />
    )

    expect(queryByText("Right button")).toBeFalsy()
  })

  it("should disable right button when rightButtonDisabled prop is true", () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper rightButtonDisabled />)

    expect(getByText("Right button")).toBeDisabled()
  })

  it('should call "onLeftButtonPress" handler when back button is pressed', () => {
    const onLeftButtonPressMock = jest.fn()
    const { getByLabelText } = renderWithWrappersTL(
      <TestWrapper onLeftButtonPress={onLeftButtonPressMock} />
    )

    fireEvent.press(getByLabelText("Header back button"))

    expect(onLeftButtonPressMock).toBeCalled()
  })

  it('should call "onRightButtonPress" handler when right button is pressed', () => {
    const onRightButtonPressMock = jest.fn()
    const { getByText } = renderWithWrappersTL(
      <TestWrapper onRightButtonPress={onRightButtonPressMock} />
    )

    fireEvent.press(getByText("Right button"))

    expect(onRightButtonPressMock).toBeCalled()
  })
})
