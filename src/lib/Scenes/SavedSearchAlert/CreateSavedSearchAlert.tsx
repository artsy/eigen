import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { getAllowedFiltersForSavedSearchInput } from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Sans, Text, useTheme } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"
import { SavedSearchAlertFormPropsBase } from "./SavedSearchAlertModel"

interface CreateSavedSearchAlertProps extends SavedSearchAlertFormPropsBase {
  visible: boolean
  onClosePress: () => void
}

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, onClosePress, ...other } = props
  const { space } = useTheme()
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const allowedFilters = getAllowedFiltersForSavedSearchInput(appliedFilters)
  const mutation = async () => {
    onClosePress()
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
          mode="create"
          aggregations={aggregations}
          filters={allowedFilters}
          mutation={mutation}
          {...other}
        />
        <Text variant="text" color="black60" textAlign="center" my={2}>
          You will be able to access all your Artist Alerts in your Profile.
        </Text>
      </ScrollView>
    </FancyModal>
  )
}
