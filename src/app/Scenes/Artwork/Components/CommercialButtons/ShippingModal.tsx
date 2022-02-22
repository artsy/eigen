import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { getLocationDetails, LocationWithDetails, SimpleLocation } from "app/utils/googleMaps"
import { Flex } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"

import { LocationAutocomplete } from "./LocationAutocomplete"

interface ShippingModalProps {
  toggleVisibility: () => void
  modalIsVisible: boolean
  setLocation: (locationDetails: LocationWithDetails) => void
  location: LocationWithDetails | null
}

export const ShippingModal: React.FC<ShippingModalProps> = (props) => {
  const { location, toggleVisibility, modalIsVisible, setLocation } = props

  const [locationInput, setLocationInput] = useState<SimpleLocation | null>(null)

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => toggleVisibility()}>
      <FancyModalHeader
        leftButtonText="Cancel"
        onLeftButtonPress={() => {
          toggleVisibility()
        }}
        rightButtonText="Apply"
        onRightButtonPress={async () => {
          const locationDetails = await getLocationDetails(locationInput as SimpleLocation)

          setLocation(locationDetails)
          toggleVisibility()
        }}
        rightButtonDisabled={!locationInput}
      >
        Add Location
      </FancyModalHeader>
      <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flex: 1 }}>
        <Flex m={2} flex={1}>
          <LocationAutocomplete onChange={setLocationInput} initialLocation={location} />
        </Flex>
      </ScrollView>
    </FancyModal>
  )
}
