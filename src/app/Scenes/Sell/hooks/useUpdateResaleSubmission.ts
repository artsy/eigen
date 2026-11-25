import {
  useUpdateResaleSubmissionMutation,
  useUpdateResaleSubmissionMutation$variables,
} from "__generated__/useUpdateResaleSubmissionMutation.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
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

/**
 * Uploads the photos, saves a step’s answers with their URLs, then calls `onSaved`. Shows an error
 * toast, without saving, when an upload or the save fails.
 */
export const useSaveResaleSubmission = ({ onSaved }: { onSaved: () => void }) => {
  const toast = useToast()
  const { submitMutation } = useUpdateResaleSubmission()
  const [saving, setSaving] = useState(false)

  const save = (input: UpdateResaleSubmissionInput, photoPaths: string[] = []) => {
    setSaving(true)

    Promise.all(photoPaths.map((path) => getConvertedImageUrlFromS3(path)))
      .then((externalImageUrls) =>
        submitMutation({
          variables: {
            input: externalImageUrls.length > 0 ? { ...input, externalImageUrls } : input,
          },
          rejectIf: (response) =>
            response.updateResaleSubmission?.resaleSubmissionOrError?.__typename !==
            "UpdateResaleSubmissionSuccess",
        })
      )
      .then(onSaved, () => toast.show(SAVE_ERROR, "bottom", { backgroundColor: "red100" }))
      .finally(() => setSaving(false))
  }

  return { save, saving }
}
