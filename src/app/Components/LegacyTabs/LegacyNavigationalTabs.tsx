import { Box } from "@artsy/palette-mobile"
import { Tab, TabsProps } from "app/Components/LegacyTabs"
import { useScreenDimensions } from "app/utils/hooks"
import React, { useState } from "react"
import { LayoutRectangle } from "react-native"
import { TabBarContainer } from "./LegacyTabBarContainer"

/**
 * Renders a list of tabs. Evenly-spaces them across the screen with
 * each tab label centered on the tab
 */
export const NavigationalTabs: React.FC<TabsProps> = ({ onTabPress, activeTab, tabs }) => {
  const [tabLayouts, setTabLayouts] = useState<Array<LayoutRectangle | null>>(tabs.map(() => null))

  const screenWidth = useScreenDimensions().width
  const tabWidth = screenWidth / tabs.length

  return (
    <TabBarContainer
      // Horizontal scrolling interfers with the vertical scrolling in case there is only one tab
      scrollEnabled={tabs.length > 1}
      activeTabIndex={activeTab}
      tabLayouts={tabLayouts}
    >
      {tabs.map(({ label }, index) => {
        return (
          <Box minWidth={tabWidth} key={label + index}>
            <Tab
              variant="xs"
              label={label}
              onPress={() => {
                onTabPress(label, index)
              }}
              active={activeTab === index}
              onLayout={(e) => {
                const layout = e.nativeEvent.layout
                setTabLayouts((layouts) => {
                  const result = layouts.slice(0)
                  result[index] = layout
                  return result
                })
              }}
            />
          </Box>
        )
      })}
    </TabBarContainer>
  )
}
