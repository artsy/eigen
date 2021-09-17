import { Tab, TabsProps } from "palette/elements/Tabs"
import React, { useState } from "react"
import { LayoutRectangle } from "react-native"
import { TabBarContainer } from "./TabBarContainer"

/**
 * Renders a  scrollable list of tabs. Tabs are not evenly spaced across screen
 */
export const ContentTabs: React.FC<TabsProps> = ({ onTabPress, activeTab, tabs }) => {
  const [tabLayouts, setTabLayouts] = useState<Array<LayoutRectangle | null>>(tabs.map(() => null))

  return (
    <TabBarContainer scrollEnabled activeTabIndex={activeTab} tabLayouts={tabLayouts}>
      {tabs.map(({ label }, index) => {
        return (
          <Tab
            key={index}
            label={label}
            active={index === activeTab}
            onLayout={(e) => {
              const layout = e.nativeEvent.layout
              setTabLayouts((layouts) => {
                const result = layouts.slice(0)
                result[index] = layout
                return result
              })
            }}
            onPress={() => {
              onTabPress(label, index)
            }}
          />
        )
      })}
    </TabBarContainer>
  )
}
