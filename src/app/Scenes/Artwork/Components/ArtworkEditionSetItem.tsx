import { Spacer, Flex, Text, RadioButton } from "@artsy/palette-mobile"
import { ArtworkEditionSetItem_item$data } from "__generated__/ArtworkEditionSetItem_item.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkEditionSetItemProps {
  item: ArtworkEditionSetItem_item$data
  isSelected: boolean
  onPress: (id: string) => void
  disabled?: boolean
}

const ArtworkEditionSetItem: React.FC<ArtworkEditionSetItemProps> = ({
  item,
  isSelected,
  onPress,
  disabled,
}) => {
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)
  const { dimensions, framedDimensions, editionOf, saleMessage } = item
  const enableFramedSize = useFeatureFlag("AREnableArtworksFramedSize")

  const handlePress = () => {
    onPress(item.internalID)
  }

  const getMetricLabel = () => {
    // Check if framed dimensions exist first (only if feature flag is enabled)
    const hasFramedDimensions = enableFramedSize && (framedDimensions?.cm || framedDimensions?.in)

    if (hasFramedDimensions) {
      let framedDimensionText = ""
      if (preferredMetric === "cm" && framedDimensions?.cm) {
        framedDimensionText = framedDimensions.cm
      } else if (preferredMetric === "in" && framedDimensions?.in) {
        framedDimensionText = framedDimensions.in
      } else {
        // display the first available framed dimension without taking into account the preferred metric
        framedDimensionText = framedDimensions?.cm ?? framedDimensions?.in ?? ""
      }

      return framedDimensionText ? `${framedDimensionText} with frame included` : ""
    }

    // Otherwise use regular dimensions
    if (preferredMetric === "cm" && dimensions?.cm) {
      return dimensions.cm
    }

    if (preferredMetric === "in" && dimensions?.in) {
      return dimensions.in
    }

    // display the first available dimension without taking into account the preferred metric
    return dimensions?.cm ?? dimensions?.in
  }

  const metric = getMetricLabel()

  return (
    <TouchableWithoutFeedback accessibilityRole="button" onPress={handlePress} disabled={disabled}>
      <Flex flexDirection="row" justifyContent="flex-start" py={2}>
        <RadioButton selected={isSelected} onPress={handlePress} disabled={disabled} />

        <Spacer x={1} />

        <Flex flex={1}>
          {!!metric && (
            <Text variant="sm-display" color="mono60">
              {metric}
            </Text>
          )}
          {!!editionOf && (
            <Text variant="sm-display" color="mono60">
              {editionOf}
            </Text>
          )}
        </Flex>

        <Spacer x={1} />

        <Text variant="sm-display">{saleMessage}</Text>
      </Flex>
    </TouchableWithoutFeedback>
  )
}

export const ArtworkEditionSetItemFragmentContainer = createFragmentContainer(
  ArtworkEditionSetItem,
  {
    item: graphql`
      fragment ArtworkEditionSetItem_item on EditionSet {
        internalID
        saleMessage
        editionOf

        dimensions {
          in
          cm
        }
        framedDimensions {
          in
          cm
        }
      }
    `,
  }
)
