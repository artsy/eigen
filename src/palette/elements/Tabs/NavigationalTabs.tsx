import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box } from "palette"
import { Tab, TabsProps } from "palette/elements/Tabs"
import React, { useState } from "react"
import { LayoutRectangle } from "react-native"
import { TabBarContainer } from "./TabBarContainer"

/**
 * Renders a list of tabs. Evenly-spaces them across the screen with
 * each tab label centered on the tab
 */

export const NavigationalTabs: React.FC<TabsProps> = ({ onTabPress, activeTab, tabs }) => {
  const [tabLayouts, setTabLayouts] = useState<Array<LayoutRectangle | null>>(tabs.map(() => null))
  const tabWidth = useScreenDimensions().width / tabs.length
  return (
    <TabBarContainer scrollEnabled={false} activeTabIndex={activeTab} tabLayouts={tabLayouts}>
      {tabs.map(({ label }, index) => {
        return (
          <Box width={tabWidth} key={label + index}>
            <Tab
              label={label}
              onPress={() => onTabPress(index)}
              active={activeTab === index}
              onLayout={(e) => {
                const layout = e.nativeEvent.layout
                setTabLayouts((layouts) => {
                  if (!layouts.every((l) => l)) {
                    const result = layouts.slice(0)
                    result[index] = layout
                    return result
                  }
                  return layouts
                })
              }}
            />
          </Box>
        )
      })}
    </TabBarContainer>
  )
}
