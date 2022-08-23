import { Flex, Text } from "palette"
import { ColoredDot, DEFAULT_DOT_COLOR } from "./ColoredDot"
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
        // We need to have a fixed height here to make sure in case the text is too long,
        // it doesn't push the graph content down
        <Flex>
          <Text variant="xs" color="black60" numberOfLines={2}>
            {text}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
