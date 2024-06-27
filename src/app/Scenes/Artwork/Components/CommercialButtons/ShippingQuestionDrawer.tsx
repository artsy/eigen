import { Box, Button, Text } from "@artsy/palette-mobile"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { LocationAutocomplete } from "app/Components/LocationAutocomplete"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { LocationWithDetails } from "app/utils/googleMaps"
import React, { useContext } from "react"

export const ShippingQuestionDrawer: React.FC = () => {
  const { state, dispatch } = useContext(ArtworkInquiryContext)

  const handleModalDismiss = () => {
    dispatch({ type: "closeShippingQuestionDialog" })
    dispatch({ type: "openInquiryDialog" })
  }

  const handleApplyButtonPress = () => {
    dispatch({ type: "closeShippingQuestionDialog" })
    dispatch({ type: "openInquiryDialog" })
  }

  const handleCancelButtonPress = () => {
    dispatch({ type: "closeShippingQuestionDialog" })
    dispatch({ type: "openInquiryDialog" })
  }

  const handleLocationChange = (locationDetails: LocationWithDetails) => {
    dispatch({ type: "selectShippingLocation", payload: locationDetails })
  }

  return (
    <AutoHeightBottomSheet
      visible={state.isShippingQuestionDialogOpen}
      onDismiss={handleModalDismiss}
    >
      <Text variant="sm-display" textAlign="center">
        Add Location
      </Text>
      <Box p={2}>
        <LocationAutocomplete
          title="Location"
          placeholder="Add Location"
          onChange={handleLocationChange}
          initialLocation={state.shippingLocation}
          floating
          FooterComponent={() => (
            <Text mt={1} color="black60">
              Sharing your location with galleries helps them provide fast and accurate shipping
              quotes.
            </Text>
          )}
          useBottomSheetInput
        />
        <Box my={4} zIndex={-100}>
          <Button
            width="100%"
            block
            onPress={handleApplyButtonPress}
            disabled={!state.shippingLocation}
          >
            Apply
          </Button>
          <Button variant="outline" width="100%" mt={2} block onPress={handleCancelButtonPress}>
            Cancel
          </Button>
        </Box>
      </Box>
    </AutoHeightBottomSheet>
  )
}
