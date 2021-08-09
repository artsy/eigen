import { Aggregations, FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Sans, Text, useTheme } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"
import { SavedSearchAlertFormPropsBase } from "./SavedSearchAlertModel"

interface CreateSavedSearchAlertProps extends SavedSearchAlertFormPropsBase {
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
      <FancyModalHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space(2) }}>
        <Sans size="8" mb={4}>
          Create an Alert
        </Sans>
        <SavedSearchAlertForm
          initialValues={{ name: "" }}
          aggregations={aggregations}
          filters={filters}
          onComplete={handleComplete}
          {...other}
        />
        <Text variant="text" color="black60" textAlign="center" my={2}>
          You will be able to access all your Artist Alerts in your Profile.
        </Text>
      </ScrollView>
    </FancyModal>
  )
}
