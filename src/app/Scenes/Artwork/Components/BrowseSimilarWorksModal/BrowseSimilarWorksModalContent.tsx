import {
  Button,
  Flex,
  Pill,
  Text,
  Box,
  /* useScreenDimensions ,*/ useTheme,
} from "@artsy/palette-mobile"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { CreateSavedSearchAlertProps } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { extractPills } from "app/Scenes/SavedSearchAlert/pillExtractors"
import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const BrowseSimilarWorksModalContent: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, params } = props
  const { attributes, aggregations, entity, onClosePress } = params
  const { localizedUnit } = useLocalizedUnit()
  // const screen = useScreenDimensions()
  const { space } = useTheme()
  const { bottom: bottomInset } = useSafeAreaInsets()

  const pills = extractPills({ attributes, aggregations, unit: localizedUnit, entity })

  return (
    <SavedSearchStoreProvider
      runtimeModel={{
        ...savedSearchModel,
        attributes: attributes as SearchCriteriaAttributes,
        aggregations,
        entity,
      }}
    >
      <FancyModal visible={visible} fullScreen>
        <Box flex={1}>
          <FancyModalHeader
            onLeftButtonPress={onClosePress}
          >{`Works by ${entity.artists[0].name}`}</FancyModalHeader>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: bottomInset,
              paddingHorizontal: space(2),
            }}
          >
            <Text color="black60" my={2}>
              Available works you may have missed based on similar filters listed below.
            </Text>

            <Flex flexDirection="row" flexWrap="wrap" mb={2}>
              {pills.map((pill, index) => (
                <Pill key={index} variant="filter" disabled mr={1}>
                  {pill.label}
                </Pill>
              ))}
            </Flex>
            {/* <GenericGrid
          width={screen.width - space(2)}
          artworks={artworksConnectionNodes}
          onPress={(slug: string) => {
            navigate(`artwork/${slug}`)
          }}
        /> */}
            <Button mt={2} block>
              Explore more on Artsy
            </Button>
          </ScrollView>
        </Box>
      </FancyModal>
    </SavedSearchStoreProvider>
  )
}
