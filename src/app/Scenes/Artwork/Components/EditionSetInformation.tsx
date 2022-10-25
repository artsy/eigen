import { EditionSetInformation_artwork$key } from "__generated__/EditionSetInformation_artwork.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { compact } from "lodash"
import { Box, Flex, Join, RadioButton, Separator, Spacer, Text } from "palette"
import { useEffect, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface EditionSetInformationProps {
  artwork: EditionSetInformation_artwork$key
  onSelectEdition: (editionId: string) => void
}

export const EditionSetInformation: React.FC<EditionSetInformationProps> = ({
  artwork,
  onSelectEdition,
}) => {
  const artworkData = useFragment(editionSetInformationFragment, artwork)
  const editionSets = compact(artworkData.editionSets ?? [])
  const firstEditionId = editionSets[0]?.internalID ?? null
  const [selectedEditionId, setSelectedEditionId] = useState(firstEditionId)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  const handleSelectEdition = (editionId: string) => {
    setSelectedEditionId(editionId)
    onSelectEdition(editionId)
  }

  useEffect(() => {
    if (selectedEditionId) {
      onSelectEdition(selectedEditionId)
    }
  }, [])

  if (editionSets.length === 0) {
    return null
  }

  return (
    <Box>
      <Separator />

      <Join separator={<Separator />}>
        {editionSets.map((edition) => {
          const { dimensions, saleMessage, editionOf } = edition
          const isSelected = edition.internalID === selectedEditionId
          const metric = preferredMetric === "cm" ? dimensions?.cm : dimensions?.in

          return (
            <TouchableWithoutFeedback
              key={edition.internalID}
              onPress={() => handleSelectEdition(edition.internalID)}
            >
              <Flex flexDirection="row" justifyContent="flex-start" my={2}>
                <RadioButton
                  selected={isSelected}
                  onPress={() => handleSelectEdition(edition.internalID)}
                />

                <Spacer ml={1} />

                <Flex flex={1}>
                  <Text variant="sm-display" color="black60">
                    {metric}
                  </Text>
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
        })}
      </Join>

      <Separator />
    </Box>
  )
}

const editionSetInformationFragment = graphql`
  fragment EditionSetInformation_artwork on Artwork {
    editionSets {
      id
      internalID
      saleMessage
      editionOf

      dimensions {
        in
        cm
      }
    }
  }
`
