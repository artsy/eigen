import { Flex } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { SavedSearchAlertForm } from "app/Scenes/SavedSearchAlert/SavedSearchAlertForm"
import { EditSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { goBack } from "app/system/navigation/navigate"

export const EditSavedSearchAlertContent = () => {
  const route =
    useRoute<RouteProp<EditSavedSearchAlertNavigationStack, "EditSavedSearchAlertContent">>()
  const { userAlertSettings, savedSearchAlertId, userAllowsEmails, onComplete, onDeleteComplete } =
    route.params

  return (
    <Flex>
      <FancyModalHeader hideBottomDivider onLeftButtonPress={goBack}>
        Edit your Alert
      </FancyModalHeader>
      <SavedSearchAlertForm
        initialValues={{
          name: userAlertSettings?.name ?? "",
          email: userAlertSettings?.email ?? false,
          push: userAlertSettings?.push ?? false,
          details: userAlertSettings?.details ?? "",
        }}
        savedSearchAlertId={savedSearchAlertId}
        userAllowsEmails={userAllowsEmails}
        onComplete={onComplete}
        onDeleteComplete={onDeleteComplete}
      />
    </Flex>
  )
}
