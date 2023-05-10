import { useColor, useSpace } from "@artsy/palette-mobile"
import {
  Tabs as BaseTabs,
  MaterialTabBar,
  CollapsibleProps,
} from "react-native-collapsible-tab-view"

const TAB_BAR_HEIGHT = 50

export interface TabsContainerProps extends CollapsibleProps {
  tabScrollEnabled?: boolean
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  renderHeader,
  children,
  initialTabName,
  tabScrollEnabled = false,
}) => {
  const space = useSpace()
  const color = useColor()

  return (
    <BaseTabs.Container
      renderHeader={renderHeader}
      headerContainerStyle={{
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        backgroundColor: color("background"),
      }}
      initialTabName={initialTabName}
      containerStyle={{
        paddingTop: space(2),
      }}
      renderTabBar={(props) => (
        <MaterialTabBar
          {...props}
          scrollEnabled={tabScrollEnabled}
          style={{
            height: TAB_BAR_HEIGHT,
            borderBottomWidth: 1,
            borderColor: color("black30"),
          }}
          contentContainerStyle={{}}
          activeColor={color("onBackground")}
          inactiveColor={color("onBackgroundMedium")}
          labelStyle={{ marginTop: 0 }} // removing the horizonal margin from the lib
          tabStyle={{
            marginHorizontal: 10,
          }} // adding the margin back here
          indicatorStyle={{
            backgroundColor: color("onBackground"),
            height: 1,
          }}
        />
      )}
    >
      {children}
    </BaseTabs.Container>
  )
}
