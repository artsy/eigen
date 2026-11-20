import {
  useUpdateResaleSubmissionMutation,
  useUpdateResaleSubmissionMutation$variables,
} from "__generated__/useUpdateResaleSubmissionMutation.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { useMutation } from "app/utils/useMutation"
import { useState } from "react"
import { graphql } from "react-relay"

export type UpdateResaleSubmissionInput = useUpdateResaleSubmissionMutation$variables["input"]

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

/** Saves a step’s answers, showing `errorMessage` in a toast when that fails */
export const useSaveResaleSubmission = (errorMessage: string) => {
  const toast = useToast()
  const { submitMutation } = useUpdateResaleSubmission()
  const [saving, setSaving] = useState(false)

  /** Resolves to whether the answers were saved */
  const save = async (input: UpdateResaleSubmissionInput) => {
    setSaving(true)

    try {
      const response = await submitMutation({ variables: { input } })
      const result = response.updateResaleSubmission?.resaleSubmissionOrError?.__typename

      if (result !== "UpdateResaleSubmissionSuccess") {
        throw new Error("updateResaleSubmission failed")
      }

      return true
    } catch {
      toast.show(errorMessage, "bottom", { backgroundColor: "red100" })
      return false
    } finally {
      setSaving(false)
    }
  }

  return { save, saving }
}
