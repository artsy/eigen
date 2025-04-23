import { Flex, useColor } from "@artsy/palette-mobile"
import React from "react"

interface PaginationBarsProps {
  currentIndex: number
  length: number
}

export const PaginationBars: React.FC<PaginationBarsProps> = ({ currentIndex, length }) => {
  const color = useColor()

  return (
    <Flex width="100%" flexDirection="row" justifyContent="space-between">
      {Array.from(Array(length)).map((_, index) => (
        <Flex
          key={index}
          height={1}
          flex={1}
          mx={0.5}
          backgroundColor={currentIndex === index ? color("mono60") : color("mono15")}
        />
      ))}
    </Flex>
  )
}
