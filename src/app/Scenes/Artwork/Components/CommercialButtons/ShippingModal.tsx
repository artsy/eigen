import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { LocationAutocomplete } from "app/Components/LocationAutocomplete"
import { LocationWithDetails } from "app/utils/googleMaps"
import { Flex, Text } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"

interface ShippingModalProps {
  toggleVisibility: () => void
  modalIsVisible: boolean
  setLocation: (locationDetails: LocationWithDetails) => void
  location: LocationWithDetails | null
}

export const ShippingModal: React.FC<ShippingModalProps> = (props) => {
  const { location, toggleVisibility, modalIsVisible, setLocation } = props

  const [locationDetails, setLocationDetails] = useState<LocationWithDetails | null>(null)

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => toggleVisibility()}>
      <FancyModalHeader
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
      </FancyModalHeader>
      <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flex: 1 }}>
        <Flex m={2} flex={1}>
          <LocationAutocomplete
            title="Location"
            placeholder="Add Location"
            onChange={setLocationDetails}
            initialLocation={location}
            floating
            FooterComponent={() => (
              <Text mt={1} color="black60">
                Sharing your location with galleries helps them provide fast and accurate shipping
                quotes.
              </Text>
            )}
          />
        </Flex>
      </ScrollView>
    </FancyModal>
  )
}
