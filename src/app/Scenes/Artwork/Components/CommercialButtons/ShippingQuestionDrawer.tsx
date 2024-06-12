import { Box, Button, Text } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { LocationAutocomplete } from "app/Components/LocationAutocomplete"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { LocationWithDetails } from "app/utils/googleMaps"
import React, { useCallback, useContext } from "react"

export const ShippingQuestionDrawer: React.FC = () => {
  const { state, dispatch } = useContext(ArtworkInquiryContext)

  const dispatchCloseInquiryDialog = useCallback(() => {
    dispatch({ type: "closeShippingQuestionDialog" })
  }, [dispatch])

  const handleModalDismiss = () => {
    dispatchCloseInquiryDialog()
  }

  const handleApplyButtonPress = () => {
    dispatchCloseInquiryDialog()
  }

  const handleCancelButtonPress = () => {
    dispatchCloseInquiryDialog()
  }

  const handleLocationChange = (locationDetails: LocationWithDetails) => {
    dispatch({ type: "selectShippingLocation", payload: locationDetails })
  }

  return (
    <AutomountedBottomSheetModal
      visible={state.isShippingQuestionDialogOpen}
      enableDynamicSizing
      onDismiss={handleModalDismiss}
    >
      <BottomSheetScrollView>
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
            <Button variant="fillGray" width="100%" mt={2} block onPress={handleCancelButtonPress}>
              Cancel
            </Button>
          </Box>
        </Box>
      </BottomSheetScrollView>
    </AutomountedBottomSheetModal>
  )
}
