import renderer from 'react-test-renderer'

/** Renders a React Component with specified layout using onLayout callback */
export const renderWithLayout = (component: any, layout: { width?: number, height?: number }) => {
  // create the component with renderer
  component = renderer.create(component)

  // create a nativeEvent with desired dimensions
  const mockNativeEvent = {
    nativeEvent: {
      layout: layout
    }
  }

  // manually trigger onLayout with mocked nativeEvent
  component.toJSON().props.onLayout(mockNativeEvent)

  // re-render
  return component.toJSON()
}
