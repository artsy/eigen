import { updateSavedSearchAlertMutation } from "__generated__/updateSavedSearchAlertMutation.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchAlertFormValues } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const updateSavedSearchAlert = (
  alertId: string,
  userAlertSettings: SavedSearchAlertFormValues,
  attributes: SearchCriteriaAttributes
): Promise<updateSavedSearchAlertMutation["response"]> => {
  const input: updateSavedSearchAlertMutation["variables"]["input"] = {
    id: alertId,
    settings: userAlertSettings,
    ...attributes,
  }

  return new Promise((resolve, reject) => {
    commitMutation<updateSavedSearchAlertMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation updateSavedSearchAlertMutation($input: updateAlertInput!) {
          updateAlert(input: $input) {
            responseOrError {
              ... on UpdateAlertSuccess {
                alert {
                  internalID
                  settings {
                    name
                  }
                  ...SavedSearchAlert_alert
                }
              }
            }
          }
        }
      `,
      variables: {
        input,
      },
      onCompleted: (response, errors) => {
        if (errors) {
          reject(errors)
        } else if (!response.updateAlert?.responseOrError?.alert) {
          reject("Something went wrong")
        } else {
          resolve(response)
        }
      },
      onError: (error) => {
        reject(error)
      },
    })
  })
}
