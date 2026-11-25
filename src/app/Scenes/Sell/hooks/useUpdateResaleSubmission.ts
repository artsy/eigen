import {
  useUpdateResaleSubmissionMutation,
  useUpdateResaleSubmissionMutation$variables,
} from "__generated__/useUpdateResaleSubmissionMutation.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { useMutation } from "app/utils/useMutation"
import { useState } from "react"
import { graphql } from "react-relay"

export type UpdateResaleSubmissionInput = useUpdateResaleSubmissionMutation$variables["input"]

const SAVE_ERROR = "We couldn’t save your answers. Please try again."

export const useUpdateResaleSubmission = () => {
  return useMutation<useUpdateResaleSubmissionMutation>({
    mutation: graphql`
      mutation useUpdateResaleSubmissionMutation($input: UpdateResaleSubmissionInput!) {
        updateResaleSubmission(input: $input) {
          resaleSubmissionOrError {
            __typename
            ... on UpdateResaleSubmissionSuccess {
              resaleSubmission {
                ...resaleSubmission_resaleSubmission
              }
            }
            ... on UpdateResaleSubmissionFailure {
              mutationError {
                message
              }
            }
          }
        }
      }
    `,
  })
}

/** Saves a step’s answers, then calls `onSaved`, or shows an error toast when that fails */
export const useSaveResaleSubmission = ({ onSaved }: { onSaved: () => void }) => {
  const toast = useToast()
  const { submitMutation } = useUpdateResaleSubmission()
  const [saving, setSaving] = useState(false)

  const save = (input: UpdateResaleSubmissionInput) => {
    setSaving(true)

    submitMutation({
      variables: { input },
      rejectIf: (response) =>
        response.updateResaleSubmission?.resaleSubmissionOrError?.__typename !==
        "UpdateResaleSubmissionSuccess",
    })
      .then(onSaved, () => toast.show(SAVE_ERROR, "bottom", { backgroundColor: "red100" }))
      .finally(() => setSaving(false))
  }

  return { save, saving }
}
