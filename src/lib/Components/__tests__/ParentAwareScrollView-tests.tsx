import { fireEvent, render } from "@testing-library/react-native"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React, { useState } from "react"
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, View, VirtualizedList } from "react-native"
import ParentAwareScrollView from "../ParentAwareScrollView"

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
  describe("it receives events from parent", () => {
    it("receives parent onScroll event when nested in a virtualized list", () => {
      // the ParentAwareScrollView nested inside the Flatlist should
      // react to the parent flatlist scroll by calling props.aFunc
      const AFlatList = () => (
        <FlatList
          data={[<ParentAwareScrollView onScroll={() => props.aFunc()} />]}
          renderItem={({ item }) => item}
          keyExtractor={(_, i) => i.toString()}
        ></FlatList>
      )
      const tree = renderWithWrappers(<AFlatList />)
      const flatList = tree.root.findByType(FlatList)
      flatList.instance._listRef._onScroll(scrollEvent)

      expect(props.aFunc).toHaveBeenCalled()
    })
  })
})
