import { Flex, Text, useColor } from "@artsy/palette-mobile"
import { LocationAutocomplete } from "app/Components/LocationAutocomplete"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { LocationWithDetails } from "app/utils/googleMaps"
import React, { useState } from "react"
import { Modal, Platform, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface ShippingModalProps {
  toggleVisibility: () => void
  modalIsVisible: boolean
  setLocation: (locationDetails: LocationWithDetails) => void
  location: LocationWithDetails | null
}

export const ShippingModal: React.FC<ShippingModalProps> = (props) => {
  const { location, toggleVisibility, modalIsVisible, setLocation } = props
  const color = useColor()
  const insets = useSafeAreaInsets()
  const [locationDetails, setLocationDetails] = useState<LocationWithDetails | null>(null)

  return (
    <Modal
      visible={modalIsVisible}
      onRequestClose={toggleVisibility}
      presentationStyle="formSheet"
      animationType="slide"
      transparent={false}
    >
      <Flex
        flex={1}
        backgroundColor={color("background")}
        // Android modals are always edge-to-edge, so the sheet renders full screen under the status bar
        style={{ paddingTop: Platform.OS === "android" ? insets.top : 0 }}
      >
        <NavigationHeader
          leftButtonText="Cancel"
          onLeftButtonPress={() => {
            toggleVisibility()
          }}
          rightButtonText="Apply"
          onRightButtonPress={() => {
            setLocation(locationDetails as LocationWithDetails)
            toggleVisibility()
          }}
          rightButtonDisabled={!locationDetails}
        >
          Add Location
        </NavigationHeader>
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flex: 1 }}>
          <Flex m={2} flex={1}>
            <LocationAutocomplete
              title="Location"
              placeholder="Add Location"
              onChange={setLocationDetails}
              initialLocation={location}
              floating
              FooterComponent={() => (
                <Text mt={1} color="mono60">
                  Sharing your location with galleries helps them provide fast and accurate shipping
                  quotes.
                </Text>
              )}
            />
          </Flex>
        </ScrollView>
      </Flex>
    </Modal>
  )
}
