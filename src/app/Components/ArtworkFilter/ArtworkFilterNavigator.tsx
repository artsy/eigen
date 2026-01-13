import { ActionType, ContextModule, OwnerType, TappedCreateAlert } from "@artsy/cohesion"
import { useColor } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native"
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
import {
  FilterArray,
  FilterParamName,
  FilterParams,
  ParamDefaultValues,
  changedFiltersParams,
  filterArtworksParams,
  getUnitedSelectedAndAppliedFilters,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { AdditionalGeneIDsOptionsScreen } from "app/Components/ArtworkFilter/Filters/AdditionalGeneIDsOptions"
import { ArtistIDsOptionsScreen } from "app/Components/ArtworkFilter/Filters/ArtistIDsOptionsScreen"
import { ArtistNationalitiesOptionsScreen } from "app/Components/ArtworkFilter/Filters/ArtistNationalitiesOptions"
import { ArtistSeriesOptionsScreen } from "app/Components/ArtworkFilter/Filters/ArtistSeriesOptions.tsx"
import { AttributionClassOptionsScreen } from "app/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { AvailabilityOptionsScreen } from "app/Components/ArtworkFilter/Filters/AvailabilityOptions"
import { CategoriesOptionsScreen } from "app/Components/ArtworkFilter/Filters/CategoriesOptions"
import { ColorsOptionsScreen } from "app/Components/ArtworkFilter/Filters/ColorsOptions"
import { EstimateRangeOptionsScreen } from "app/Components/ArtworkFilter/Filters/EstimateRangeOptions"
import { FramedOptionsScreen } from "app/Components/ArtworkFilter/Filters/FramedOptions"
import { GalleriesAndInstitutionsOptionsScreen } from "app/Components/ArtworkFilter/Filters/GalleriesAndInstitutionsOptions"
import { MaterialsTermsOptionsScreen } from "app/Components/ArtworkFilter/Filters/MaterialsTermsOptions"
import { MediumOptionsScreen } from "app/Components/ArtworkFilter/Filters/MediumOptions"
import { PriceRangeOptionsScreen } from "app/Components/ArtworkFilter/Filters/PriceRangeOptions"
import { SizesOptionsScreen } from "app/Components/ArtworkFilter/Filters/SizesOptionsScreen"
import { SortOptionsScreen } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { TimePeriodOptionsScreen } from "app/Components/ArtworkFilter/Filters/TimePeriodOptions"
import { ViewAsOptionsScreen } from "app/Components/ArtworkFilter/Filters/ViewAsOptions"
import { WaysToBuyOptionsScreen } from "app/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { YearOptionsScreen } from "app/Components/ArtworkFilter/Filters/YearOptions"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import { CreateSavedSearchModal } from "app/Scenes/SavedSearchAlert/CreateSavedSearchModal"
import { GlobalStore } from "app/store/GlobalStore"
import { KeyboardAvoidingContainer } from "app/utils/keyboard/KeyboardAvoidingContainer"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import { useEffect, useState } from "react"
import { Modal, Platform, ViewProps } from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useTracking } from "react-tracking"
import {
  FilterModalMode as ArtworkFilterMode,
  ArtworkFilterOptionsScreen,
} from "./ArtworkFilterOptionsScreen"
import { AuctionHouseOptionsScreen } from "./Filters/AuctionHouseOptions"
import { LocationCitiesOptionsScreen } from "./Filters/LocationCitiesOptions"
import { getSearchCriteriaFromFilters } from "./SavedSearch/searchCriteriaHelpers"
import { SavedSearchEntity } from "./SavedSearch/types"
import { ArtworkFilterApplyButton } from "./components/ArtworkFilterApplyButton"

interface ArtworkFilterProps extends ViewProps {
  closeModal?: () => void
  exitModal?: () => void
  openCreateAlertModal?: () => void
  id?: string
  initiallyAppliedFilters?: FilterArray
  visible: boolean
  mode: ArtworkFilterMode
  slug?: string
  name?: string
  title?: string
  query?: string
  shouldShowCreateAlertButton?: boolean
}

interface ArtworkFilterOptionsScreenParams {
  closeModal: () => void
  exitModal: () => void
  id?: string
  initiallyAppliedFilters?: FilterArray
  mode: ArtworkFilterMode
  slug?: string
  title?: string
}

// This needs to be a `type` rather than an `interface`
// see src/app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm.tsx#L35

export type ArtworkFilterNavigationStack = {
  AdditionalGeneIDsOptionsScreen: undefined
  ArtistIDsOptionsScreen: undefined
  ArtistNationalitiesOptionsScreen: undefined
  ArtistSeriesOptionsScreen: undefined
  AttributionClassOptionsScreen: undefined
  AuctionHouseOptionsScreen: undefined
  AvailabilityOptionsScreen: undefined
  CategoriesOptionsScreen: undefined
  ColorOptionsScreen: undefined
  ColorsOptionsScreen: undefined
  EstimateRangeOptionsScreen: undefined
  FilterOptionsScreen: ArtworkFilterOptionsScreenParams
  FramedOptionsScreen: undefined
  GalleriesAndInstitutionsOptionsScreen: undefined
  LocationCitiesOptionsScreen: undefined
  MaterialsTermsOptionsScreen: undefined
  MediumOptionsScreen: undefined
  PriceRangeOptionsScreen: undefined
  SizesOptionsScreen: undefined
  SortOptionsScreen: undefined
  TimePeriodOptionsScreen: undefined
  ViewAsOptionsScreen: undefined
  WaysToBuyOptionsScreen: undefined
  YearOptionsScreen: undefined
}

const Stack = createStackNavigator<ArtworkFilterNavigationStack>()

export const ArtworkFilterNavigator: React.FC<ArtworkFilterProps> = (props) => {
  const theme = useNavigationTheme()
  const color = useColor()
  const insets = useSafeAreaInsets()

  const tracking = useTracking()
  const { id, mode, slug, name, query, shouldShowCreateAlertButton, closeModal, exitModal } = props
  const [isCreateAlertModalVisible, setIsCreateAlertModalVisible] = useState(false)

  const savedSearchEntity: SavedSearchEntity = {
    artists: [{ id: id as string, name: name as string }],
    owner: {
      type: OwnerType.artist,
      id: id as string,
      slug: slug as string,
    },
  }

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const selectedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const previouslyAppliedFiltersState = ArtworksFiltersStore.useStoreState(
    (state) => state.previouslyAppliedFilters
  )
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  const applyFiltersAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.applyFiltersAction
  )
  const resetFiltersAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.resetFiltersAction
  )

  const filterState = ArtworksFiltersStore.useStoreState((state) => state)
  const unitedFilters = getUnitedSelectedAndAppliedFilters(filterState)
  const attributes = getSearchCriteriaFromFilters(savedSearchEntity, unitedFilters)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding

  const handleClosingModal = () => {
    // dismiss alert-finish on modal close,so the user can proceed with the next onboarding step
    dismiss("alert-finish")
    resetFiltersAction()
    closeModal?.()
  }

  const saveRecentPriceRange = () => {
    const priceRange = selectedFiltersState.find(
      (filter) => filter.paramName === FilterParamName.priceRange
    )

    if (priceRange?.paramValue && priceRange.paramValue !== ParamDefaultValues.priceRange) {
      /**
       * We wait until the filter modal is closed, then save the recent price range
       * Otherwise the recent price range will be displayed immediately after clicking on the "Show Results" button,
       * Which can negatively affect the UI
       */
      setTimeout(() => {
        GlobalStore.actions.recentPriceRanges.addNewPriceRange(priceRange.paramValue as string)
      }, 500)
    }
  }

  const applyFilters = () => {
    saveRecentPriceRange()
    applyFiltersAction()
    exitModal?.()
  }

  const trackChangeFilters = ({
    actionType,
    changedParams,
    contextModule,
    currentParams,
    ownerEntity,
    screenName,
    artworkQuery,
  }: {
    actionType: ActionType
    changedParams: any
    contextModule?: ContextModule
    currentParams: FilterParams
    ownerEntity: OwnerEntityTypes | OwnerType
    screenName: PageNames
    artworkQuery?: string
  }) => {
    tracking.trackEvent({
      context_module: contextModule,
      context_screen: screenName,
      context_screen_owner_type: ownerEntity,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      current: JSON.stringify(currentParams),
      changed: JSON.stringify(changedParams),
      action_type: actionType,
      ...(artworkQuery && { query: artworkQuery }),
    })
  }

  const isApplyButtonEnabled =
    selectedFiltersState.length > 0 ||
    (previouslyAppliedFiltersState.length === 0 && appliedFiltersState.length > 0)

  const handleApplyPress = () => {
    const appliedFiltersParams = filterArtworksParams(appliedFiltersState, filterTypeState)
    // TODO: Update to use cohesion
    switch (mode) {
      case ArtworkFilterMode.Collection:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.Collection,
          ownerEntity: OwnerEntityTypes.Collection,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
      case ArtworkFilterMode.ArtistArtworks:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.ArtistPage,
          ownerEntity: OwnerEntityTypes.Artist,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
      case ArtworkFilterMode.Fair:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.FairPage,
          ownerEntity: OwnerEntityTypes.Fair,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
      case ArtworkFilterMode.SaleArtworks:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.Auction,
          ownerEntity: OwnerEntityTypes.Auction,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
      case ArtworkFilterMode.Show:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.ShowPage,
          ownerEntity: OwnerEntityTypes.Show,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
      case ArtworkFilterMode.AuctionResults:
        trackChangeFilters({
          actionType: ActionType.auctionResultsFilterParamsChanged,
          screenName: PageNames.ArtistPage,
          ownerEntity: OwnerEntityTypes.Artist,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
          contextModule: ContextModule.auctionResults,
        })
        break
      case ArtworkFilterMode.Partner:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.PartnerPage,
          ownerEntity: OwnerEntityTypes.Partner,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
      case ArtworkFilterMode.ArtistSeries:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.ArtistSeriesPage,
          ownerEntity: OwnerEntityTypes.ArtistSeries,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
      case ArtworkFilterMode.Gene:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.GenePage,
          ownerEntity: OwnerEntityTypes.Gene,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
      case ArtworkFilterMode.Search:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.Search,
          ownerEntity: OwnerType.search,
          artworkQuery: query,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
      case ArtworkFilterMode.Collect:
        trackChangeFilters({
          actionType: ActionType.commercialFilterParamsChanged,
          screenName: PageNames.Collect,
          ownerEntity: OwnerType.collect,
          currentParams: appliedFiltersParams,
          changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
        })
        break
    }
    applyFilters()
  }

  const handleCreateAlertPress = () => {
    KeyboardController.dismiss()
    requestAnimationFrame(() => {
      setIsCreateAlertModalVisible(true)
      tracking.trackEvent(tracks.tappedCreateAlert(id as string, name as string))
    })
  }

  const setSelectedMetric = ArtworksFiltersStore.useStoreActions((state) => state.setSizeMetric)
  const { localizedUnit } = useLocalizedUnit()

  // initializes the selected metric to the user preferred metric
  useEffect(() => {
    setSelectedMetric(localizedUnit)
  }, [])

  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={theme}>
        <Modal
          visible={props.visible}
          onDismiss={handleClosingModal}
          animationType="slide"
          testID="artwork-filter-navigator"
        >
          <KeyboardAvoidingContainer>
            <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: color("background") }}>
              <Stack.Navigator
                // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
                detachInactiveScreens={false}
                screenOptions={{
                  ...TransitionPresets.SlideFromRightIOS,
                  headerShown: false,
                  cardStyle: {
                    backgroundColor: color("background"),
                    paddingTop: Platform.OS === "ios" ? insets?.top : 0,
                  },
                }}
              >
                <Stack.Screen
                  name="FilterOptionsScreen"
                  component={ArtworkFilterOptionsScreen}
                  initialParams={props}
                />
                <Stack.Screen name="ArtistIDsOptionsScreen" component={ArtistIDsOptionsScreen} />
                <Stack.Screen
                  name="ArtistSeriesOptionsScreen"
                  component={ArtistSeriesOptionsScreen}
                />
                <Stack.Screen
                  name="AttributionClassOptionsScreen"
                  component={AttributionClassOptionsScreen}
                />
                <Stack.Screen
                  name="AuctionHouseOptionsScreen"
                  component={AuctionHouseOptionsScreen}
                />
                <Stack.Screen
                  name="AvailabilityOptionsScreen"
                  component={AvailabilityOptionsScreen}
                />
                <Stack.Screen name="ColorsOptionsScreen" component={ColorsOptionsScreen} />
                <Stack.Screen
                  name="EstimateRangeOptionsScreen"
                  component={EstimateRangeOptionsScreen}
                />
                <Stack.Screen name="FramedOptionsScreen" component={FramedOptionsScreen} />
                <Stack.Screen
                  name="GalleriesAndInstitutionsOptionsScreen"
                  component={GalleriesAndInstitutionsOptionsScreen}
                />
                <Stack.Screen
                  name="AdditionalGeneIDsOptionsScreen"
                  component={AdditionalGeneIDsOptionsScreen}
                />
                <Stack.Screen name="MediumOptionsScreen" component={MediumOptionsScreen} />
                <Stack.Screen
                  name="PriceRangeOptionsScreen"
                  component={PriceRangeOptionsScreen}
                  options={{
                    // Avoid PanResponser conflicts between the slider and the slide back gesture
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen name="SizesOptionsScreen" component={SizesOptionsScreen} />
                <Stack.Screen name="SortOptionsScreen" component={SortOptionsScreen} />
                <Stack.Screen name="TimePeriodOptionsScreen" component={TimePeriodOptionsScreen} />
                <Stack.Screen name="ViewAsOptionsScreen" component={ViewAsOptionsScreen} />
                <Stack.Screen
                  name="YearOptionsScreen"
                  component={YearOptionsScreen}
                  options={{
                    // Avoid PanResponser conflicts between the slider and the slide back gesture
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen name="WaysToBuyOptionsScreen" component={WaysToBuyOptionsScreen} />
                <Stack.Screen name="CategoriesOptionsScreen" component={CategoriesOptionsScreen} />
                <Stack.Screen
                  name="MaterialsTermsOptionsScreen"
                  component={MaterialsTermsOptionsScreen}
                />
                <Stack.Screen
                  name="ArtistNationalitiesOptionsScreen"
                  component={ArtistNationalitiesOptionsScreen}
                />
                <Stack.Screen
                  name="LocationCitiesOptionsScreen"
                  component={LocationCitiesOptionsScreen}
                />
              </Stack.Navigator>

              <ArtworkFilterApplyButton
                disabled={!isApplyButtonEnabled}
                onPress={handleApplyPress}
                onCreateAlertPress={handleCreateAlertPress}
                shouldShowCreateAlertButton={shouldShowCreateAlertButton}
                progressiveOnboardingEnabled={mode === ArtworkFilterMode.ArtistArtworks}
              />

              <CreateSavedSearchModal
                visible={isCreateAlertModalVisible}
                entity={savedSearchEntity}
                closeModal={() => setIsCreateAlertModalVisible(false)}
                onComplete={exitModal}
                attributes={attributes}
                sizeMetric={filterState.sizeMetric}
              />
            </SafeAreaView>
          </KeyboardAvoidingContainer>
        </Modal>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}

export const tracks = {
  tappedCreateAlert: (artistId: string, artistSlug: string): TappedCreateAlert => ({
    action: ActionType.tappedCreateAlert,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
    context_module: ContextModule.filterScreen,
  }),
}
