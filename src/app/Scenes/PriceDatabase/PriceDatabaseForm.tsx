import { stringify } from "querystring"
import { OwnerType } from "@artsy/cohesion"
import { ArtsyKeyboardAvoidingView, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtistAutosuggest } from "app/Components/ArtistAutosuggest/ArtistAutosuggest"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import { FilterDisplayName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFilterOptionItem } from "app/Components/ArtworkFilter/components/ArtworkFilterOptionItem"
import { Button } from "app/Components/Button"
import { PriceDatabaseFormModel } from "app/Scenes/PriceDatabase/validation"
import { navigate } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { snakeCase } from "lodash"

// Utility method to convert keys of a hash into snake case.
export const paramsToSnakeCase = (params: object) => {
  return Object.entries(params).reduce((acc, [field, value]) => {
    let snakeCased = snakeCase(field)
    if (snakeCased.endsWith("i_ds")) {
      snakeCased = snakeCased.replace("i_ds", "ids")
    } else if (snakeCased.endsWith("i_d")) {
      snakeCased = snakeCased.replace("i_d", "ids")
    }

    return { ...acc, [snakeCased]: value }
  }, {})
}

const ALLOWED_FILTERS = ["artistId", "categories", "sizes"]

export const filterSearchFilters = (filters: PriceDatabaseFormModel, allowedFilters: string[]) =>
  Object.keys(filters)
    .filter((key) => allowedFilters.includes(key))
    .reduce((obj, key) => {
      // @ts-ignore
      obj[key] = filters[key]
      return obj
    }, {})

export const PriceDatabaseForm: React.FC<StackScreenProps<ArtworkFilterNavigationStack>> = ({
  navigation,
}) => {
  const { values, isValid } = useFormikContext<PriceDatabaseFormModel>()

  const handleSearch = () => {
    const pathName = `/artist/${values.artistId}/auction-results`
    const searchFilters = filterSearchFilters(values, ALLOWED_FILTERS)
    const queryString = stringify(paramsToSnakeCase(searchFilters))
    const paramFlag = "scroll_to_market_signals=true"

    const url = queryString ? `${pathName}?${queryString}&${paramFlag}` : `${pathName}?${paramFlag}`

    navigate(url)
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.consignmentFlow,
      })}
    >
      <ArtsyKeyboardAvoidingView>
        <Flex m={2}>
          <Text variant="xl">Artsy Price</Text>
          <Text variant="xl" mb={0.5}>
            Database
          </Text>

          <Text variant="xs">
            Unlimited access to millions of auction results and art market data — for free.
          </Text>

          <Spacer y={2} />

          <Flex>
            <ArtistAutosuggest title={null} />

            <Spacer y={2} />

            <ArtworkFilterOptionItem
              item={{
                displayText: FilterDisplayName.additionalGeneIDs,
                filterType: "additionalGeneIDs",
                ScreenComponent: "AdditionalGeneIDsOptionsScreen",
              }}
              onPress={() => {
                navigation.navigate("MediumOptionsScreen")
              }}
            />

            <Spacer y={2} />

            <Button disabled={!isValid} width="100%" maxWidth="440px" onPress={handleSearch} block>
              Search
            </Button>
          </Flex>
        </Flex>
      </ArtsyKeyboardAvoidingView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
