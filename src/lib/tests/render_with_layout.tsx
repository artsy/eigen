import * as renderer from "react-test-renderer"

/** Renders a React Component with specified layout using onLayout callback */
export const renderWithLayout = (component: any, layout: { width?: number; height?: number }) => {
  // create the component with renderer
  component = renderer.create(component)

  // create a nativeEvent with desired dimensions
  const mockNativeEvent = {
    nativeEvent: {
      layout,
    },
  }

  // manually trigger onLayout with mocked nativeEvent
  const json = component.toJSON()

  if (json.props.onLayout) {
    json.props.onLayout(mockNativeEvent)
  }

  // re-render
  return component.toJSON()
}
