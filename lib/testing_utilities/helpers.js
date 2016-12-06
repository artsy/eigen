import renderer from 'react-test-renderer'

export const setupWithLayout = (component, layout) => {
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