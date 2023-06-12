import { RouteProp, useRoute } from "@react-navigation/native"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { SavedSearchAlertForm } from "app/Scenes/SavedSearchAlert/SavedSearchAlertForm"
import { EditSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"

export const EditSavedSearchAlertContent = () => {
  const route =
    useRoute<RouteProp<EditSavedSearchAlertNavigationStack, "EditSavedSearchAlertContent">>()
  const { userAlertSettings, savedSearchAlertId, userAllowsEmails, onComplete, onDeleteComplete } =
    route.params

  return (
    <PageWithSimpleHeader title="Edit your Alert">
      <SavedSearchAlertForm
        initialValues={{
          name: userAlertSettings?.name ?? "",
          email: userAlertSettings?.email ?? false,
          push: userAlertSettings?.push ?? false,
        }}
        savedSearchAlertId={savedSearchAlertId}
        userAllowsEmails={userAllowsEmails}
        onComplete={onComplete}
        onDeleteComplete={onDeleteComplete}
      />
    </PageWithSimpleHeader>
  )
}
