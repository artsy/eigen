import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { getLocationDetails, LocationDetails, SimpleLocationAutocomplete } from "lib/utils/googleMaps"
import { Flex } from "palette"
import React, { useState } from "react"

import { LocationAutocomplete } from "./LocationAutocomplete"

interface ShippingModalProps {
  toggleVisibility: () => void
  modalIsVisible: boolean
  setLocation: (locationDetails: LocationDetails) => void
  location: LocationDetails | null
}

export const ShippingModal: React.FC<ShippingModalProps> = (props) => {
  const { location, toggleVisibility, modalIsVisible, setLocation } = props

  const [locationInput, setLocationInput] = useState<SimpleLocationAutocomplete | null>(null)

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => toggleVisibility()}>
      <FancyModalHeader
        leftButtonText="Cancel"
        onLeftButtonPress={() => {
          toggleVisibility()
        }}
        rightButtonText="Apply"
        onRightButtonPress={async () => {
          const locationDetails = await getLocationDetails(locationInput as SimpleLocationAutocomplete)

          setLocation(locationDetails)
          toggleVisibility()
        }}
        rightButtonDisabled={!locationInput}
      >
        Add Location
      </FancyModalHeader>
      <Flex m={2} flex={1}>
        <LocationAutocomplete onChange={setLocationInput} initialLocation={location} />
      </Flex>
    </FancyModal>
  )
}
