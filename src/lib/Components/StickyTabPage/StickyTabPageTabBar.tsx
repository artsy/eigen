import { Box, color, Flex, Sans, space } from "@artsy/palette"
import React, { useState } from "react"
import { TouchableOpacity, View } from "react-native"

export const TAB_BAR_HEIGHT = 48

export const StickyTabPageTabBar: React.FC<{
  labels: string[]
  initialActiveIndex: number
  onIndexChange(index: number): void
}> = ({ labels, initialActiveIndex, onIndexChange }) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)
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
      {labels.map((label, index) => (
        <Tab
          key={index}
          label={label}
          active={index === activeIndex}
          onPress={() => {
            setActiveIndex(index)
            onIndexChange(index)
          }}
        />
      ))}
    </View>
  )
}

const Tab: React.FC<{ label: string; active: boolean; onPress(): void }> = ({ label, active, onPress }) => {
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
