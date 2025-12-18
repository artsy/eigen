import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { BackButton, Button, Flex, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtistAutosuggest } from "app/Components/ArtistAutosuggest/ArtistAutosuggest"
import { FilterDisplayName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFilterOptionItem } from "app/Components/ArtworkFilter/components/ArtworkFilterOptionItem"
import { useToast } from "app/Components/Toast/toastHook"
import { PriceDatabaseNavigationStack } from "app/Scenes/PriceDatabase/PriceDatabase"
import { PriceDatabaseBenefits } from "app/Scenes/PriceDatabase/components/PriceDatabaseBenefits"
import {
  ALLOWED_FILTERS,
  filterSearchFilters,
  paramsToSnakeCase,
} from "app/Scenes/PriceDatabase/utils/helpers"
import { PriceDatabaseSearchModel } from "app/Scenes/PriceDatabase/validation"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { KeyboardAvoidingContainer } from "app/utils/keyboard/KeyboardAvoidingContainer"
import { useFormikContext } from "formik"
import { stringify } from "query-string"
import { ScrollView } from "react-native"
import { useTracking } from "react-tracking"

type PriceDatabaseScreenProps = StackScreenProps<
  PriceDatabaseNavigationStack,
  "PriceDatabaseSearch"
>

export const PriceDatabaseSearch: React.FC<PriceDatabaseScreenProps> = ({ navigation }) => {
  const toast = useToast()
  const { trackEvent } = useTracking()
  const { space } = useTheme()

  const { values, isValid } = useFormikContext<PriceDatabaseSearchModel>()

  const handleSearch = () => {
    if (!values.artistId) {
      console.error("No Artist selected.")
      toast.show("Please select an artist.", "top", {
        backgroundColor: "red100",
      })

      return
    }

    const pathName = `/artist/${values.artistId}/auction-results`
    const searchFilters = filterSearchFilters(values, ALLOWED_FILTERS)
    const queryString = stringify(paramsToSnakeCase(searchFilters), { arrayFormat: "index" })
    const paramFlag = "scroll_to_market_signals=true"

    const url = queryString ? `${pathName}?${queryString}&${paramFlag}` : `${pathName}?${paramFlag}`

    trackEvent(tracks.searchTapped(values, url, queryString, searchFilters))

    navigate(url)
  }

  return (
    <KeyboardAvoidingContainer>
      <ScrollView keyboardShouldPersistTaps="handled">
        <BackButton
          onPress={() => goBack()}
          style={{ top: space(2), left: space(2), zIndex: 100 }}
        />

        <Flex my={2}>
          <Flex mx={2} my={2}>
            <Text variant="lg" mb={0.5}>
              Artsy Price Database
            </Text>

            <Text variant="xs">
              Unlimited access to millions of auction results and art market data — for free.
            </Text>

            <Spacer y={2} />

            <ArtistAutosuggest title={null} placeholder="Search by artist name" useSlugAsId />
          </Flex>

          <ArtworkFilterOptionItem
            item={{
              displayText: FilterDisplayName.medium,
              filterType: "medium",
              ScreenComponent: "MediumOptionsScreen",
            }}
            onPress={() => {
              navigation.navigate("MediumOptionsScreen")
            }}
          />

          <ArtworkFilterOptionItem
            item={{
              displayText: FilterDisplayName.sizes,
              filterType: "sizes",
              ScreenComponent: "SizesOptionsScreen",
            }}
            onPress={() => {
              navigation.navigate("SizesOptionsScreen")
            }}
          />

          <Spacer y={2} />

          <Flex mx={2}>
            <Button
              mx="auto"
              disabled={!isValid}
              width="100%"
              maxWidth="440px"
              onPress={handleSearch}
              block
            >
              Search
            </Button>
          </Flex>

          <Spacer y={2} />

          <PriceDatabaseBenefits />
        </Flex>
      </ScrollView>
    </KeyboardAvoidingContainer>
  )
}

const tracks = {
  searchTapped: (
    values: PriceDatabaseSearchModel,
    pathName: string,
    queryString: string,
    searchFilters: object
  ) => ({
    action: ActionType.searchedPriceDatabase,
    context_module: ContextModule.priceDatabaseLanding,
    context_owner_type: OwnerType.priceDatabase,
    destination_owner_type: OwnerType.artistAuctionResults,
    destination_owner_slug: values.artistId,
    destination_path: pathName,
    filters: JSON.stringify(searchFilters),
    query: queryString,
  }),
}
