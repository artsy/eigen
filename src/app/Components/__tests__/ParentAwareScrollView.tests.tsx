import { fireEvent, screen } from "@testing-library/react-native"
import ParentAwareScrollView from "app/Components/ParentAwareScrollView"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { FlatList } from "react-native"

const props = {
  aFunc: jest.fn(),
}

const scrollEvent = {
  nativeEvent: {
    contentSize: { height: 600, width: 400 },
    contentOffset: { y: 150, x: 0 },
    layoutMeasurement: { height: 100, width: 100 },
  },
}

describe("<ParentAwareScrollView>", () => {
  it("receives parent onScroll event when nested in a virtualized list", async () => {
    // the ParentAwareScrollView nested inside the Flatlist should
    // react to the parent flatlist scroll by calling props.aFunc
    const AFlatList = () => (
      <FlatList
        testID="flat-list"
        data={[
          <ParentAwareScrollView key="a" onScroll={(e: typeof scrollEvent) => props.aFunc(e)} />,
        ]}
        renderItem={({ item }) => item}
      />
    )
    await renderWithWrappers(<AFlatList />)
    await fireEvent.scroll(screen.getByTestId("flat-list"), scrollEvent)

    expect(props.aFunc).toHaveBeenCalled()
    // v14's fireEvent.scroll fills in the rest of a real scroll event, so match on the values we sent
    expect(props.aFunc).toHaveBeenCalledWith(
      expect.objectContaining({ nativeEvent: expect.objectContaining(scrollEvent.nativeEvent) })
    )
  })
})
