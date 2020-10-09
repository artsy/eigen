import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Flex } from "palette"
import React, { useState } from "react"
import NavigatorIOS from "react-native-navigator-ios"

import { LocationAutocomplete } from "./LocationAutocomplete"

interface ShippingModalProps {
  closeModal?: () => void
  exitModal?: () => void
  toggleVisibility: () => void
  navigator?: NavigatorIOS
  modalIsVisible: boolean
  setLocation: (location: string) => void
  location: string
}

export const ShippingModal: React.FC<ShippingModalProps> = (props) => {
  const { location, toggleVisibility, modalIsVisible, setLocation } = props

  const [locationInput, setLocationInput] = useState("")

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => toggleVisibility()}>
      <FancyModalHeader
        leftButtonText="Cancel"
        onLeftButtonPress={() => toggleVisibility()}
        rightButtonText="Apply"
        onRightButtonPress={() => {
          setLocation(locationInput)
          toggleVisibility()
        }}
        rightButtonDisabled={!Boolean(locationInput)}
      >
        Add Location
      </FancyModalHeader>
      <Flex m={2}>
        <LocationAutocomplete onChange={setLocationInput} initialLocation={location} />
      </Flex>
    </FancyModal>
  )
}
