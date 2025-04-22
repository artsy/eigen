import { Flex, useColor, Text, Touchable } from "@artsy/palette-mobile"
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
                color={!(selectedBand === band.name) ? color("mono30") : color("mono100")}
                size={6}
              />
              <Text
                variant="xs"
                color={!(selectedBand === band.name) ? color("mono30") : color("mono100")}
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
