import { color } from "@artsy/palette"
import { useEffect, useMemo } from "react"
import React from "react"
import { Animated } from "react-native"
import { useSpringValue } from "./useSpringValue"

export const PaginationDot: React.FC<{ diameter: number; selected: boolean }> = ({ diameter, selected }) => {
  const opacity = useSpringValue(selected ? 1 : 0.1)

  return (
    <Animated.View
      style={{
        marginHorizontal: diameter * 0.8,
        borderRadius: diameter / 2,
        width: diameter,
        height: diameter,
        backgroundColor: "black",
        opacity,
      }}
    />
  )
}
