import { Button, Flex, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { PriceRange } from "app/Components/ArtworkFilter/Filters/helpers"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { PriceRangeContainer } from "app/Components/PriceRange/PriceRangeContainer"
import { DEFAULT_PRICE_RANGE } from "app/Components/PriceRange/constants"
import { getBarsFromAggregations } from "app/Components/PriceRange/utils/getBarsFromAggregations"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { Suspense, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const AlertPriceRangeScreen = () => {
  const artistID = SavedSearchStore.useStoreState((state) => state.entity.artists[0].id)
  const data = useLazyLoadQuery(AlertPriceRangeScreenQuery, {
    artistID: artistID,
  })
  // TODO: fix any
  const histogramBars = getBarsFromAggregations(
    (data as any).artist?.filterArtworksConnection?.aggregations
  )

  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const [rawRange, setRawRange] = useState(attributes.priceRange || DEFAULT_PRICE_RANGE)

  const setValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.setValueToAttributesByKeyAction
  )

  const navigation =
    useNavigation<NavigationProp<CreateSavedSearchAlertNavigationStack, "AlertPriceRange">>()
  const handleOnButtonPress = () => {
    setValueToAttributesByKeyAction({
      key: SearchCriteria.priceRange,
      value: rawRange,
    })
    navigation.goBack()
  }

  const handleClear = () => {
    setRawRange(DEFAULT_PRICE_RANGE)
  }

  const handleUpdateRange = (updatedRange: PriceRange) => {
    setRawRange(updatedRange.join("-"))
  }

  return (
    <Flex>
      <ArtworkFilterBackHeader
        title="Price"
        onLeftButtonPress={() => navigation.goBack()}
        rightButtonText="Clear"
        onRightButtonPress={handleClear}
      />
      <PriceRangeContainer
        rawPriceRange={rawRange}
        histogramBars={histogramBars}
        header={<Text variant="sm">Set price range you are interested in</Text>}
        onPriceRangeUpdate={handleUpdateRange}
      />

      <Spacer y={2} />

      <Flex m={2}>
        <Button block onPress={handleOnButtonPress}>
          Set Price Range
        </Button>
      </Flex>
    </Flex>
  )
}

const AlertPriceRangeScreenQuery = graphql`
  query AlertPriceRangeScreenQuery($artistID: String!) {
    artist(id: $artistID) {
      filterArtworksConnection(aggregations: [SIMPLE_PRICE_HISTOGRAM], first: 0) {
        aggregations {
          slice
          counts {
            count
            name
            value
          }
        }
      }
    }
  }
`

export const AlertPriceRangeScreenQueryRenderer: React.FC<{}> = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <AlertPriceRangeScreen />
    </Suspense>
  )
}
