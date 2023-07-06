import { Button, Flex, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { PriceRange } from "app/Components/ArtworkFilter/Filters/helpers"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { PriceRangeContainer } from "app/Components/PriceRange/PriceRangeContainer"
import { DEFAULT_PRICE_RANGE } from "app/Components/PriceRange/constants"
import { getBarsFromAggregations } from "app/Components/PriceRange/utils/getBarsFromAggregations"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { GlobalStore } from "app/store/GlobalStore"
import { Suspense, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

type AlertPriceRangeScreenProps = StackScreenProps<
  CreateSavedSearchAlertNavigationStack,
  "AlertPriceRange"
>

export const AlertPriceRangeScreen: React.FC<
  StackScreenProps<CreateSavedSearchAlertNavigationStack>
> = ({ navigation }) => {
  const artistID = SavedSearchStore.useStoreState((state) => state.entity.artists[0].id)
  const data = useLazyLoadQuery(AlertPriceRangeScreenQuery, {
    artistID: artistID,
  })

  const histogramBars = getBarsFromAggregations(
    (data as any).artist?.filterArtworksConnection?.aggregations
  )
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const [filterPriceRange, setFilterPriceRange] = useState(
    attributes.priceRange || DEFAULT_PRICE_RANGE
  )
  const setValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.setValueToAttributesByKeyAction
  )

  const handleOnButtonPress = () => {
    setValueToAttributesByKeyAction({
      key: SearchCriteria.priceRange,
      value: filterPriceRange,
    })
    navigation.goBack()

    /**
     * We wait until the filter modal is closed, then save the recent price range
     * Otherwise the recent price range will be displayed immediately after clicking on the "Set Price Range" button,
     * Which can negatively affect the UI
     */
    setTimeout(() => {
      GlobalStore.actions.recentPriceRanges.addNewPriceRange(filterPriceRange)
    }, 500)
  }

  const handleClear = () => {
    setFilterPriceRange(DEFAULT_PRICE_RANGE)
  }

  const handleUpdateRange = (updatedRange: PriceRange) => {
    setFilterPriceRange(updatedRange.join("-"))
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
        filterPriceRange={filterPriceRange}
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

export const AlertPriceRangeScreenQueryRenderer: React.FC<AlertPriceRangeScreenProps> = (props) => {
  return (
    <Suspense fallback={<Spinner testID="alert-price-range-spinner" />}>
      <AlertPriceRangeScreen {...props} />
    </Suspense>
  )
}
