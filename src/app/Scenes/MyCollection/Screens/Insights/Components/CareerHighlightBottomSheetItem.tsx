import { uniq } from "lodash"
import { Box, FairIcon, Flex, GroupIcon, PublicationIcon, SoloIcon, Text } from "palette"
import { useScreenDimensions } from "shared/hooks"
import { CareerHighlightKindValueType } from "../CareerHighlightBottomSheet"

interface CareerHighlightBottomSheetItemProps {
  year: string | number
  highlights: Record<CareerHighlightKindValueType, string[]>
}
export const CareerHighlightBottomSheetItem: React.FC<CareerHighlightBottomSheetItemProps> = ({
  year,
  highlights,
}) => {
  const getHeader = (header: string, bodyCount: number) => {
    let text = ""
    let IconComponent: JSX.Element | null = null
    switch (header) {
      case "Solo Show":
        text =
          bodyCount > 1 ? "Solo shows at major institutions" : "Solo show at a major institution"
        IconComponent = <SoloIcon />
        break
      case "Group Show":
        text =
          bodyCount > 1 ? "Group shows at major institutions" : "Group show at a major institution"
        IconComponent = <GroupIcon />
        break
      case "Review":
        text =
          bodyCount > 1
            ? "Reviewed by major art publications"
            : "Reviewed by a major art publication"
        IconComponent = <PublicationIcon />
        break
      case "Biennial Inclusion":
        text =
          bodyCount > 1 ? "Included in multiple major biennials" : "Included in a major biennial"
        IconComponent = <FairIcon />
        break
      default:
    }
    return { text, IconComponent }
  }

  const renderHighlight = () => {
    const headers = Object.keys(highlights)
    return headers.map((header) => {
      const body = uniq(highlights[header as CareerHighlightKindValueType]).map((b) => (
        <Text key={b} color="black60">
          {b}
        </Text>
      ))
      const HeaderObj = getHeader(header, body.length)
      return (
        <Flex mb={1} key={header} flexDirection="row">
          <Box mr={1} mt={0.5}>
            {HeaderObj.IconComponent}
          </Box>
          <Flex>
            <Text>{HeaderObj.text}</Text>
            {body}
          </Flex>
        </Flex>
      )
    })
  }

  const dimensions = useScreenDimensions()

  return (
    <Flex flex={1} minWidth={dimensions.width} p={2}>
      <Text variant="lg">{year} Career Highlights</Text>
      <Flex mt={2}>{renderHighlight()}</Flex>
    </Flex>
  )
}
