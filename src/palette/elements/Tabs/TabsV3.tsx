import { Box, Flex, Text, useColor } from "palette"
import { ChevronIcon } from "palette/svgs"
import React, { Dispatch, SetStateAction } from "react"
import { TouchableOpacity, View } from "react-native"
import { CheckMark } from "../Checkbox/Checkbox"

export type TabsType = Array<{
  label: string
}>

interface TabProps {
  label: string
  active: boolean
  onPress: () => void
  tabType: "navigation" | "content" | "steps"
  completed?: boolean
}

/**
 * The render method for an individual tab. Will underline the currently
 * active tab.
 */
export const Tab: React.FC<TabProps> = ({ label, active, onPress, tabType, completed }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          height: 55,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 15,
        }}
      >
        <Text variant={active ? "mediumText" : "text"}>{label}</Text>
        {tabType === "steps" && !!completed && <CheckMark size={10} color="green100" />}
        {tabType === "steps" && <ChevronIcon />}
      </View>
    </TouchableOpacity>
  )
}

interface TabsProps {
  setActiveTab: Dispatch<SetStateAction<number>>
  activeTab: number
  tabs: TabsType
  tabType: "navigation" | "content" | "steps"
}

const Container: React.FC<Pick<TabsProps, "tabType">> = ({ tabType, children }) => {
  const color = useColor()
  if (tabType === "content") {
    return <View style={{ flexDirection: "row" }}>{children}</View>
  }
  return (
    <Flex
      flexDirection="row"
      backgroundColor="white"
      borderBottomColor={color("black10")}
      borderBottomWidth="1px"
      px="2"
    >
      {children}
    </Flex>
  )
}

/**
 * Renders a list of tabs. Evenly-spaces them across the screen.
 */
export const Tabs: React.FC<TabsProps> = ({ setActiveTab, activeTab, tabs, tabType }) => {
  const color = useColor()
  const tabWidth = 100 / tabs.length
  return (
    <Container tabType={tabType}>
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
            <Tab label={label} onPress={() => setActiveTab(index)} active={active} tabType={tabType} />
          </Box>
        )
      })}
    </Container>
  )
}
