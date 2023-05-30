import { useColor, useSpace } from "@artsy/palette-mobile"
import {
  Tabs as BaseTabs,
  MaterialTabBar,
  CollapsibleProps,
} from "react-native-collapsible-tab-view"

const TAB_BAR_HEIGHT = 50

export interface TabsContainerProps extends CollapsibleProps {
  // This prop is more immediate than onTabChange, which waits till the
  // transition takes place
  onTabPress?: (tabName: string) => void
  tabScrollEnabled?: boolean
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  children,
  initialTabName,
  renderHeader,
  tabScrollEnabled = false,
  onTabPress,
  ...tabContainerProps
}) => {
  const space = useSpace()
  const color = useColor()

  return (
    <BaseTabs.Container
      {...tabContainerProps}
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
      renderTabBar={(tabBarProps) => {
        return (
          <>
            <MaterialTabBar
              {...tabBarProps}
              scrollEnabled={tabScrollEnabled}
              onTabPress={(tab) => {
                tabBarProps.onTabPress(tab)
                onTabPress?.(tab)
              }}
              style={{
                height: TAB_BAR_HEIGHT,
                borderBottomWidth: 1,
                borderColor: color("black30"),
              }}
              contentContainerStyle={{}}
              activeColor={color("onBackground")}
              inactiveColor={color("onBackgroundMedium")}
              labelStyle={{ marginTop: 0 }} // removing the horizonal margin from the lib
              indicatorStyle={{
                backgroundColor: color("onBackground"),
                height: 1,
              }}
            />
          </>
        )
      }}
    >
      {children}
    </BaseTabs.Container>
  )
}
