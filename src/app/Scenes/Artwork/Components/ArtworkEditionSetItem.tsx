import { ArtworkEditionSetItem_item$key } from "__generated__/ArtworkEditionSetItem_item.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex, RadioButton, Spacer, Text } from "palette"
import { TouchableWithoutFeedback } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArtworkEditionSetItemProps {
  item: ArtworkEditionSetItem_item$key
  isSelected: boolean
  onPress: (id: string) => void
}

export const ArtworkEditionSetItem: React.FC<ArtworkEditionSetItemProps> = ({
  item,
  isSelected,
  onPress,
}) => {
  const data = useFragment(artworkEditionSetItemFragment, item)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)
  const { dimensions, editionOf, saleMessage } = data

  const handlePress = () => {
    onPress(data.internalID)
  }

  const getMetricLabel = () => {
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
    <TouchableWithoutFeedback onPress={handlePress}>
      <Flex flexDirection="row" justifyContent="flex-start" py={2}>
        <RadioButton selected={isSelected} onPress={handlePress} />

        <Spacer ml={1} />

        <Flex flex={1}>
          {!!metric && (
            <Text variant="sm-display" color="black60">
              {metric}
            </Text>
          )}
          {!!editionOf && (
            <Text variant="sm-display" color="black60">
              {editionOf}
            </Text>
          )}
        </Flex>

        <Spacer ml={1} />

        <Text variant="sm-display">{saleMessage}</Text>
      </Flex>
    </TouchableWithoutFeedback>
  )
}

const artworkEditionSetItemFragment = graphql`
  fragment ArtworkEditionSetItem_item on EditionSet {
    internalID
    saleMessage
    editionOf

    dimensions {
      in
      cm
    }
  }
`
