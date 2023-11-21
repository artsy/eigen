import { BackButton } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { SavedSearchAlertForm } from "app/Scenes/SavedSearchAlert/SavedSearchAlertForm"
import { EditSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { goBack } from "app/system/navigation/navigate"

export const EditSavedSearchAlertContent = () => {
  const route =
    useRoute<RouteProp<EditSavedSearchAlertNavigationStack, "EditSavedSearchAlertContent">>()
  const { userAlertSettings, savedSearchAlertId, userAllowsEmails, onComplete, onDeleteComplete } =
    route.params

  return (
    <PageWithSimpleHeader
      title="Edit your Alert"
      titleWeight="regular"
      noSeparator
      left={<BackButton onPress={goBack} />}
    >
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
    </PageWithSimpleHeader>
  )
}
