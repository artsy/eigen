import { Flex, Text, Touchable } from "palette"
import { useColor } from "palette/hooks"

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
        <Flex key={band.name + index} mx={3} mb={2}>
          <Touchable
            haptic="impactMedium"
            onPress={() => onBandSelected(band.name)}
            testID="band"
            accessibilityLabel={band.accessibilityLabel}
          >
            <Text
              variant="xs"
              color={!(selectedBand === band.name) ? color("black60") : undefined}
              fontWeight={selectedBand === band.name ? "500" : undefined}
            >
              {band.name}
            </Text>
          </Touchable>
        </Flex>
      ))}
    </Flex>
  )
}
