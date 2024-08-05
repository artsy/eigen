export const getMockCollapsibleTabs = () => {
  const React = require("react-native")
  const MockedTabs = ({ name, children }: any) => (
    <React.View>
      <React.Text>{name}</React.Text>
      {children}
    </React.View>
  )

  return {
    Tabs: {
      Container: React.View,
      FlatList: React.FlatList,
      FlashList: React.FlatList,
      Lazy: React.View,
      ScrollView: React.ScrollView,
      Tab: MockedTabs,
      MasonryFlashList: React.FlatList,
    },
    useCurrentTabScrollY: () => ({ value: 0 }),
    useFocusedTab: () => "SomeFocusedTab",
    useHeaderMeasurements: () => ({ height: { value: 0 }, top: { value: 0 } }),
    useTabNameContext: () => "Tab",
  }
}
