import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Sans, Text, useTheme } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"

interface CreateSavedSearchAlertProps {
  visible: boolean
  onClosePress: () => void
}

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, onClosePress } = props
  const { space } = useTheme()

  return (
    <FancyModal visible={visible} fullScreen>
      <FancyModalHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space(2) }}>
        <Sans size="8">Create an Alert</Sans>
        <Sans size="3t" mt={1} mb={4}>
          Receive alerts as Push Notifications directly to your device.
        </Sans>
        <SavedSearchAlertForm onSaved={onClosePress} />
        <Text variant="text" color="black60" textAlign="center" mt={2}>
          You will be able to access all your Artist Alerts in your Profile.
        </Text>
      </ScrollView>
    </FancyModal>
  )
}
