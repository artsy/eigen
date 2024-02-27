import { SearchCriteriaAttributes } from "__generated__/getSavedSearchIdByCriteriaQuery.graphql"
import { updateSavedSearchAlertMutation } from "__generated__/updateSavedSearchAlertMutation.graphql"
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
                }
              }
            }
          }
        }
      `,
      variables: {
        input,
      },
      onCompleted: (response) => {
        resolve(response)
      },
      onError: (error) => {
        reject(error)
      },
    })
  })
}
