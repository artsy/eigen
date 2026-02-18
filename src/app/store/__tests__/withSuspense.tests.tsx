import { render } from "@testing-library/react-native"
import { NoFallback, SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { View } from "react-native"

const TestRenderer = () => <View testID="test-id"></View>

describe("withSuspense", () => {
  it("directly renders the component without any wrappers", () => {
    const WrappedComponent = withSuspense({
      Component: TestRenderer,
      LoadingFallback: SpinnerFallback,
      ErrorFallback: NoFallback,
    })

    const { root } = render(<WrappedComponent />)
    expect(root.props.testID).toBe("test-id")
  })
})
