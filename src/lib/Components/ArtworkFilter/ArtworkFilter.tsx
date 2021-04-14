import { ActionType, ContextModule } from "@artsy/cohesion"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"

import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import {
  changedFiltersParams,
  FilterArray,
  filterArtworksParams,
  FilterParamName,
  FilterParams,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import _ from "lodash"
import { Box, Button, Separator } from "palette"
import React from "react"
import { View, ViewProperties } from "react-native"
import { useTracking } from "react-tracking"
import { AdditionalGeneIDsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/AdditionalGeneIDsOptions"
import { ArtistIDsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/ArtistIDsOptionsScreen"
import { AttributionClassOptionsScreen } from "lib/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { CategoriesOptionsScreen } from "lib/Components/ArtworkFilter/Filters/CategoriesOptions"
import { ColorOptionsScreen } from "lib/Components/ArtworkFilter/Filters/ColorOptions"
import { ColorsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/ColorsOptions"
import { EstimateRangeOptionsScreen } from "lib/Components/ArtworkFilter/Filters/EstimateRangeOptions"
import { GalleryOptionsScreen } from "lib/Components/ArtworkFilter/Filters/GalleryOptions"
import { InstitutionOptionsScreen } from "lib/Components/ArtworkFilter/Filters/InstitutionOptions"
import { MediumOptionsScreen } from "lib/Components/ArtworkFilter/Filters/MediumOptions"
import { PriceRangeOptionsScreen } from "lib/Components/ArtworkFilter/Filters/PriceRangeOptions"
import { SizeOptionsScreen } from "lib/Components/ArtworkFilter/Filters/SizeOptions"
import { SizesOptionsScreen } from "lib/Components/ArtworkFilter/Filters/SizesOptions"
import { SortOptionsScreen } from "lib/Components/ArtworkFilter/Filters/SortOptions"
import { TimePeriodMultiOptionsScreen } from "lib/Components/ArtworkFilter/Filters/TimePeriodMultiOptions"
import { TimePeriodOptionsScreen } from "lib/Components/ArtworkFilter/Filters/TimePeriodOptions"
import { ViewAsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/ViewAsOptions"
import { WaysToBuyOptionsScreen } from "lib/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { YearOptionsScreen } from "lib/Components/ArtworkFilter/Filters/YearOptions"
import { FancyModal } from "../FancyModal/FancyModal"
import { FilterModalMode as ArtworkFilterMode, ArtworkFilterOptionsScreen } from "./ArtworkFilterOptionsScreen"
import styled from "styled-components/native"

interface ArtworkFilterProps extends ViewProperties {
  closeModal?: () => void
  exitModal?: () => void
  id: string
  initiallyAppliedFilters?: FilterArray
  isFilterArtworksModalVisible: boolean
  mode: ArtworkFilterMode
  slug: string
  title?: string
}

interface ArtworkFilterOptionsScreenParams {
  closeModal: () => void
  exitModal: () => void
  id: string
  initiallyAppliedFilters?: FilterArray
  mode: ArtworkFilterMode
  slug: string
  title?: string
}

// This needs to be a `type` rather than an `interface`
// see src/lib/Scenes/MyCollection/Screens/ArtworkFormModal/MyCollectionArtworkFormModal.tsx#L35
// tslint:disable-next-line:interface-over-type-literal
export type ArtworkFilterNavigationStack = {
  AdditionalGeneIDsOptionsScreen: undefined
  ArtistIDsOptionsScreen: undefined
  AttributionClassOptionsScreen: undefined
  CategoriesOptionsScreen: undefined
  ColorOptionsScreen: undefined
  ColorsOptionsScreen: undefined
  EstimateRangeOptionsScreen: undefined
  FilterOptionsScreen: ArtworkFilterOptionsScreenParams
  GalleryOptionsScreen: undefined
  InstitutionOptionsScreen: undefined
  MediumOptionsScreen: undefined
  PriceRangeOptionsScreen: undefined
  SizeOptionsScreen: undefined
  SizesOptionsScreen: undefined
  SortOptionsScreen: undefined
  TimePeriodOptionsScreen: undefined
  ViewAsOptionsScreen: undefined
  WaysToBuyOptionsScreen: undefined
  YearOptionsScreen: undefined
}

const Stack = createStackNavigator<ArtworkFilterNavigationStack>()

export const ArtworkFilterNavigator: React.FC<ArtworkFilterProps> = (props) => {
  const tracking = useTracking()
  const shouldUseImprovedArtworkFilters = useFeatureFlag("ARUseImprovedArtworkFilters")
  const { exitModal, id, mode, slug, closeModal } = props

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const selectedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const previouslyAppliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.previouslyAppliedFilters)
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  const applyFiltersAction = ArtworksFiltersStore.useStoreActions((action) => action.applyFiltersAction)
  const resetFiltersAction = ArtworksFiltersStore.useStoreActions((action) => action.resetFiltersAction)

  const handleClosingModal = () => {
    resetFiltersAction()
    closeModal?.()
  }

  const applyFilters = () => {
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
  }: {
    actionType: ActionType
    changedParams: any
    contextModule?: ContextModule
    currentParams: FilterParams
    ownerEntity: OwnerEntityTypes
    screenName: PageNames
  }) => {
    tracking.trackEvent({
      context_module: contextModule,
      context_screen: screenName,
      context_screen_owner_type: ownerEntity,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      current: currentParams,
      changed: changedParams,
      action_type: actionType,
    })
  }

  const getApplyButtonCount = () => {
    let selectedFiltersSum = selectedFiltersState.length

    // For Auction results, the earliestCreatedYear and latestCreatedYear filters behave like one
    if (filterTypeState === "auctionResult") {
      const hasEarliestCreatedYearFilterEnabled = !!selectedFiltersState.find(
        (filter) => filter.paramName === FilterParamName.earliestCreatedYear
      )
      const hasLatestCreatedYearFilterEnabled = !!selectedFiltersState.find(
        (filter) => filter.paramName === FilterParamName.latestCreatedYear
      )
      if (hasEarliestCreatedYearFilterEnabled && hasLatestCreatedYearFilterEnabled) {
        --selectedFiltersSum
      }
    }

    // For Sale Artworks, the artistsIDs and the includeArtworksByFollowedArtists filters behave like one
    if (filterTypeState === "saleArtwork") {
      const hasArtistsIFollow = !!selectedFiltersState.find(
        (filter) => filter.paramName === FilterParamName.artistsIFollow
      )
      const hasArtistIDs = !!selectedFiltersState.find((filter) => filter.paramName === FilterParamName.artistIDs)

      if (hasArtistIDs && hasArtistsIFollow) {
        --selectedFiltersSum
      }
    }
    return selectedFiltersSum > 0 ? `Apply (${selectedFiltersSum})` : "Apply"
  }

  const isApplyButtonEnabled =
    selectedFiltersState.length > 0 || (previouslyAppliedFiltersState.length === 0 && appliedFiltersState.length > 0)

  return (
    <NavigationContainer independent>
      <FancyModal visible={props.isFilterArtworksModalVisible} onBackgroundPressed={handleClosingModal} maxHeight={550}>
        <View style={{ flex: 1 }}>
          <Stack.Navigator
            // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
            detachInactiveScreens={false}
            screenOptions={{
              ...TransitionPresets.SlideFromRightIOS,
              headerShown: false,
              safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
              cardStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen name="FilterOptionsScreen" component={ArtworkFilterOptionsScreen} initialParams={props} />
            <Stack.Screen name="ArtistIDsOptionsScreen" component={ArtistIDsOptionsScreen} />
            <Stack.Screen name="AttributionClassOptionsScreen" component={AttributionClassOptionsScreen} />
            <Stack.Screen
              name="ColorOptionsScreen"
              component={shouldUseImprovedArtworkFilters ? ColorsOptionsScreen : ColorOptionsScreen}
            />
            <Stack.Screen name="EstimateRangeOptionsScreen" component={EstimateRangeOptionsScreen} />
            <Stack.Screen name="GalleryOptionsScreen" component={GalleryOptionsScreen} />
            <Stack.Screen name="AdditionalGeneIDsOptionsScreen" component={AdditionalGeneIDsOptionsScreen} />
            <Stack.Screen name="InstitutionOptionsScreen" component={InstitutionOptionsScreen} />
            <Stack.Screen name="MediumOptionsScreen" component={MediumOptionsScreen} />
            <Stack.Screen name="PriceRangeOptionsScreen" component={PriceRangeOptionsScreen} />
            <Stack.Screen name="SizeOptionsScreen" component={SizeOptionsScreen} />
            <Stack.Screen name="SizesOptionsScreen" component={SizesOptionsScreen} />
            <Stack.Screen name="SortOptionsScreen" component={SortOptionsScreen} />
            <Stack.Screen
              name="TimePeriodOptionsScreen"
              component={shouldUseImprovedArtworkFilters ? TimePeriodMultiOptionsScreen : TimePeriodOptionsScreen}
            />
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
          </Stack.Navigator>

          <Separator my={0} />

          <ApplyButtonContainer>
            <ApplyButton
              disabled={!isApplyButtonEnabled}
              onPress={() => {
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
                }
                applyFilters()
              }}
              block
              width={100}
              variant="primaryBlack"
              size="large"
            >
              {shouldUseImprovedArtworkFilters ? "Show results" : getApplyButtonCount()}
            </ApplyButton>
          </ApplyButtonContainer>
        </View>
      </FancyModal>
    </NavigationContainer>
  )
}

export const ApplyButton = styled(Button)``
export const ApplyButtonContainer = styled(Box)`
  padding: 20px;
  padding-bottom: 30px;
`
