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
      Lazy: React.View,
      ScrollView: React.ScrollView,
      Tab: MockedTabs,
    },
    useFocusedTab: () => "SomeFocusedTab",
    useHeaderMeasurements: () => ({ height: { value: 0 } }),
    useTabNameContext: () => "Tab",
  }
}
