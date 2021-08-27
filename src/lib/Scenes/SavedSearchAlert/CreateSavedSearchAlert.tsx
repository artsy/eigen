import { Aggregations, FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Sans, Spacer, Text, useTheme } from "palette"
import React from "react"
import { Platform, ScrollView } from "react-native"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"
import { SavedSearchAlertFormPropsBase } from "./SavedSearchAlertModel"

export interface CreateSavedSearchAlertProps extends SavedSearchAlertFormPropsBase {
  visible: boolean
  filters: FilterData[]
  aggregations: Aggregations
  onClosePress: () => void
  onComplete: () => void
}

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, filters, aggregations, onClosePress, onComplete, ...other } = props
  const { space } = useTheme()

  const handleComplete = async () => {
    onComplete()
  }

  return (
    <FancyModal visible={visible} fullScreen>
      {Platform.OS === "android" && <Spacer mt={5} />}
      <FancyModalHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: space(2) }}
      >
        <Sans size="8" mb={1}>
          Create an Alert
        </Sans>
        <Sans size="3t" mb={4}>
          Receive alerts as Push Notifications directly to your device.
        </Sans>
        <SavedSearchAlertForm
          initialValues={{ name: "" }}
          aggregations={aggregations}
          filters={filters}
          onComplete={handleComplete}
          {...other}
        />
        <Text variant="text" color="black60" textAlign="center" my={2}>
          You will be able to access all your Saved Alerts in your Profile.
        </Text>
      </ScrollView>
    </FancyModal>
  )
}
