import {
  useUpdateResaleSubmissionMutation,
  useUpdateResaleSubmissionMutation$variables,
} from "__generated__/useUpdateResaleSubmissionMutation.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { useMutation } from "app/utils/useMutation"
import { useRef, useState } from "react"
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

interface UploadState {
  /** Each photo’s upload progress, from 0 to 1 */
  progress: number[]
  done: number
}

/**
 * Uploads the photos, saves a step’s answers with their URLs, then calls `onSaved`. Shows an error
 * toast, without saving, when an upload or the save fails. `uploadProgress` is set only while the
 * photos upload.
 */
export const useSaveResaleSubmission = ({ onSaved }: { onSaved: () => void }) => {
  const toast = useToast()
  const { submitMutation } = useUpdateResaleSubmission()
  const [saving, setSaving] = useState(false)
  const [upload, setUpload] = useState<UploadState | null>(null)
  // Uploads that outlive a failed attempt keep reporting, and must not touch the next attempt
  const currentAttempt = useRef<object | null>(null)

  const save = (input: UpdateResaleSubmissionInput, photoPaths: string[] = []) => {
    const attempt = {}
    currentAttempt.current = attempt
    const update = (change: (state: UploadState) => UploadState) =>
      setUpload((state) => (currentAttempt.current === attempt && state ? change(state) : state))

    setSaving(true)
    setUpload(photoPaths.length > 0 ? { progress: photoPaths.map(() => 0), done: 0 } : null)

    Promise.all(
      photoPaths.map((path, index) =>
        getConvertedImageUrlFromS3(path, (value) =>
          update((state) => ({
            ...state,
            progress: state.progress.map((current, i) => (i === index ? value : current)),
          }))
        ).then((url) => {
          update((state) => ({ ...state, done: state.done + 1 }))
          return url
        })
      )
    )
      .then((externalImageUrls) => {
        setUpload(null)

        return submitMutation({
          variables: {
            input: externalImageUrls.length > 0 ? { ...input, externalImageUrls } : input,
          },
          rejectIf: (response) =>
            response.updateResaleSubmission?.resaleSubmissionOrError?.__typename !==
            "UpdateResaleSubmissionSuccess",
        })
      })
      .then(onSaved, () => toast.show(SAVE_ERROR, "bottom", { backgroundColor: "red100" }))
      .finally(() => {
        setUpload(null)
        setSaving(false)
      })
  }

  const uploadProgress = upload && {
    done: upload.done,
    total: upload.progress.length,
    fraction: upload.progress.reduce((sum, value) => sum + value, 0) / upload.progress.length,
  }

  return { save, saving, uploadProgress }
}
