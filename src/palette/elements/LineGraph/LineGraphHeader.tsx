import { Flex, Text } from "palette"
import React from "react"
import { Dimensions } from "react-native"
import { ColoredDot, DEFAULT_DOT_COLOR } from "./ColoredDot"
import { LineChartData } from "./types"

type LineGraphHeaderProps = Omit<LineChartData["dataMeta"], "xHighlightIcon" | "yHighlightIcon">

export const LineGraphHeader: React.FC<LineGraphHeaderProps> = ({
  title,
  description,
  text,
  tintColor,
}) => {
  const maxWidth = Dimensions.get("window").width / 1.35
  return (
    <Flex maxWidth={maxWidth}>
      {!!title && (
        <Text fontWeight="500" variant="md">
          {title}
        </Text>
      )}
      {!!description && (
        <Flex flexDirection="row" alignItems="center">
          <ColoredDot color={tintColor ?? DEFAULT_DOT_COLOR} />
          <Text variant="xs" color="black60">
            {description}
          </Text>
        </Flex>
      )}
      {!!text && (
        <Text variant="xs" color="black60">
          {text}
        </Text>
      )}
    </Flex>
  )
}
