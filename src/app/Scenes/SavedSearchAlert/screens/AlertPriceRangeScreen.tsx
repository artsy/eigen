import { Button, Flex, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import {
  AlertPriceRangeScreenQuery,
  AlertPriceRangeScreenQuery$data,
} from "__generated__/AlertPriceRangeScreenQuery.graphql"
import { PriceRange } from "app/Components/ArtworkFilter/Filters/helpers"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { PriceRangeContainer } from "app/Components/PriceRange/PriceRangeContainer"
import { DEFAULT_PRICE_RANGE } from "app/Components/PriceRange/constants"
import { getBarsFromAggregations } from "app/Components/PriceRange/utils"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { GlobalStore } from "app/store/GlobalStore"
import { strictWithSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

type AlertPriceRangeScreenQRProps = StackScreenProps<
  CreateSavedSearchAlertNavigationStack,
  "AlertPriceRange"
>

interface AlertPriceRanceScreenProps extends AlertPriceRangeScreenQRProps {
  artist: AlertPriceRangeScreenQuery$data["artist"]
}

export const AlertPriceRangeScreen: React.FC<AlertPriceRanceScreenProps> = ({
  navigation,
  artist,
}) => {
  const histogramBars = getBarsFromAggregations(
    (artist as any)?.filterArtworksConnection?.aggregations
  )
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const [filterPriceRange, setFilterPriceRange] = useState(
    attributes.priceRange || DEFAULT_PRICE_RANGE
  )
  const addValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.addValueToAttributesByKeyAction
  )

  const handleOnButtonPress = () => {
    addValueToAttributesByKeyAction({
      key: SearchCriteria.priceRange,
      value: filterPriceRange,
    })
    GlobalStore.actions.recentPriceRanges.addNewPriceRange(filterPriceRange)

    navigation.goBack()
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

const alertPriceRangeScreenQuery = graphql`
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

const Placeholder: React.FC<{}> = () => (
  <Flex flex={1} justifyContent="center" alignItems="center">
    <Spinner testID="alert-price-range-spinner" />
  </Flex>
)

export const AlertPriceRangeScreenQueryRenderer: React.FC<AlertPriceRangeScreenQRProps> =
  strictWithSuspense(
    (props) => {
      const artistID = SavedSearchStore.useStoreState((state) => state.entity.artists[0].id)
      const data = useLazyLoadQuery<AlertPriceRangeScreenQuery>(alertPriceRangeScreenQuery, {
        artistID: artistID,
      })

      return <AlertPriceRangeScreen artist={data.artist} {...props} />
    },
    Placeholder,
    undefined
  )
