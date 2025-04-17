import { Flex, Text } from "@artsy/palette-mobile"
import { ColoredDot } from "./ColoredDot"
import { LineChartData } from "./types"

type LineGraphHeaderProps = Omit<LineChartData["dataMeta"], "xHighlightIcon" | "yHighlightIcon">

export const LineGraphHeader: React.FC<LineGraphHeaderProps> = ({
  title,
  description,
  text,
  tintColor,
}) => {
  return (
    <Flex px={2}>
      {!!title && (
        <Text fontWeight="500" variant="sm-display">
          {title}
        </Text>
      )}
      {!!description && (
        <Flex flexDirection="row" alignItems="center">
          <ColoredDot color={tintColor ?? "transparent"} />
          <Text variant="xs" color="mono60">
            {description}
          </Text>
        </Flex>
      )}
      {!!text && (
        // We need to have a fixed height here to make sure in case the text is too long,
        // it doesn't push the graph content down
        <Flex>
          <Text variant="xs" color="mono60" numberOfLines={2}>
            {text}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
