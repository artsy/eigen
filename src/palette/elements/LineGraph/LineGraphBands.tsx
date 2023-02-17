import { Flex, useColor, Text } from "@artsy/palette-mobile"
import { Touchable } from "palette"
import { ColoredDot } from "./ColoredDot"

export interface LineGraphBandProps {
  bands: Array<{ name: string; accessibilityLabel?: string }>
  onBandSelected: (band: string) => void
  selectedBand?: string
}

export const LineGraphBands: React.FC<LineGraphBandProps> = ({
  bands,
  onBandSelected,
  selectedBand,
}) => {
  const color = useColor()
  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center">
      {bands.map((band, index) => (
        <Flex key={band.name + index} mx={2} mb={2}>
          <Touchable
            haptic="impactMedium"
            onPress={() => onBandSelected(band.name)}
            testID="band"
            accessibilityLabel={band.accessibilityLabel}
          >
            <Flex flexDirection="row" alignItems="center">
              <ColoredDot
                color={!(selectedBand === band.name) ? color("black30") : color("black100")}
                size={6}
              />
              <Text
                variant="xs"
                color={!(selectedBand === band.name) ? color("black30") : color("black100")}
                fontWeight={selectedBand === band.name ? "500" : undefined}
              >
                {band.name}
              </Text>
            </Flex>
          </Touchable>
        </Flex>
      ))}
    </Flex>
  )
}
