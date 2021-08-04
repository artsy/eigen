import { Box, ChevronIcon, Flex, Pill, Sans, Text, Touchable, useColor } from "palette"
import React from "react"

interface AlertListItemProps {
  title: string
  pills: string[]
  onPress?: () => void
}

export const AlertListItem: React.FC<AlertListItemProps> = (props) => {
  const { title, pills, onPress } = props
  const color = useColor()

  return (
    <Touchable onPress={onPress} underlayColor={color("black5")}>
      <Box p={2}>
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex flex={1} flexDirection="row" mr="2">
            <Text variant="text">{title}</Text>
          </Flex>
          <ChevronIcon direction="right" fill="black60" />
        </Flex>
        <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
        {pills.map((pill, index) => (
          <Pill m={0.5} key={`filter-label-${index}`}>
            {pill}
          </Pill>
        ))}
        </Flex>
      </Box>
    </Touchable>
  )
}
