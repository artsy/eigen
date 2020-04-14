import { Box, color, Flex, Sans, space } from "@artsy/palette"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { useStickyTabPageContext } from "./StickyTabPage"

export const TAB_BAR_HEIGHT = 48

export const StickyTabPageTabBar: React.FC = () => {
  const { tabLabels, activeTabIndex, setActiveTabIndex } = useStickyTabPageContext()
  activeTabIndex.useUpdates()
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: color("black30"),
        height: TAB_BAR_HEIGHT,
        flexDirection: "row",
        paddingHorizontal: space(2),
      }}
    >
      {tabLabels.map((label, index) => (
        <StickyTab
          key={index}
          label={label}
          active={index === activeTabIndex.current}
          onPress={() => {
            setActiveTabIndex(index)
          }}
        />
      ))}
    </View>
  )
}

export const StickyTab: React.FC<{ label: string; active: boolean; onPress(): void }> = ({
  label,
  active,
  onPress,
}) => {
  return (
    <Flex style={{ flex: 1, height: TAB_BAR_HEIGHT }}>
      <TouchableOpacity onPress={onPress}>
        <Box
          style={{
            height: TAB_BAR_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: active ? color("black100") : color("black30"),
          }}
        >
          <Sans size="3" weight={active ? "medium" : "regular"}>
            {label}
          </Sans>
        </Box>
      </TouchableOpacity>
    </Flex>
  )
}
