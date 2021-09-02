import { Box, Flex, useColor } from "palette"
import { Tab } from "palette/elements/Tabs"
import React, { Dispatch, SetStateAction } from "react"

export type TabsType = Array<{
  label: string
}>

interface TabsProps {
  setActiveTab: Dispatch<SetStateAction<number>>
  activeTab: number
  tabs: TabsType
}

/**
 * Renders a list of tabs. Evenly-spaces them across the screen.
 */
export const NavigationTabs: React.FC<TabsProps> = ({ setActiveTab, activeTab, tabs }) => {
  const color = useColor()
  const tabWidth = 100 / tabs.length
  return (
    <Flex
      flexDirection="row"
      backgroundColor="white"
      borderBottomColor={color("black10")}
      borderBottomWidth="1px"
      px="2"
    >
      {tabs.map(({ label }, index) => {
        const active = activeTab === index
        return (
          <Box
            width={`${tabWidth}%`}
            borderBottomColor={active ? color("black100") : "transparent"}
            borderBottomWidth="2px"
            position="relative"
            bottom="-1px"
            key={label}
          >
            <Tab label={label} onPress={() => setActiveTab(index)} active={active} />
          </Box>
        )
      })}
    </Flex>
  )
}
