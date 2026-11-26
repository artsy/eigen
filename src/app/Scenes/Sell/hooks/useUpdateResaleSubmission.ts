import { useUpdateResaleSubmissionConditionPhotosQuery } from "__generated__/useUpdateResaleSubmissionConditionPhotosQuery.graphql"
import {
  useUpdateResaleSubmissionMutation,
  useUpdateResaleSubmissionMutation$variables,
} from "__generated__/useUpdateResaleSubmissionMutation.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { SellConditionPhoto } from "app/Scenes/Sell/Components/SellConditionPhotos"
import { useDeleteResaleSubmissionImage } from "app/Scenes/Sell/hooks/useDeleteResaleSubmissionImage"
import { toSavedConditionPhotos } from "app/Scenes/Sell/utils/conditionPhotos"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { useMutation } from "app/utils/useMutation"
import { useRef, useState } from "react"
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay"

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
                ...conditionPhotos_resaleSubmission
                # Step 2 prefills the notes from the store, so they must not go stale
                notes
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

const conditionPhotosQuery = graphql`
  query useUpdateResaleSubmissionConditionPhotosQuery($id: String!) {
    me {
      resaleSubmission(id: $id) {
        ...conditionPhotos_resaleSubmission
      }
    }
  }
`

/** Step 2’s photos: the current list, and the IDs saved on the submission */
export interface ConditionPhotoChanges {
  photos: SellConditionPhoto[]
  savedPhotoIDs: string[]
}

interface UploadState {
  /** Each photo’s upload progress, from 0 to 1 */
  progress: number[]
  done: number
}

interface SaveOptions {
  /** Gets the photos the submission now holds, or null when the response left them out */
  onSaved: (savedPhotos: SellConditionPhoto[] | null) => void
  /** Gets the photos the submission holds, after a failed save that changed photos */
  onPhotosReloaded?: (savedPhotos: SellConditionPhoto[]) => void
}

/**
 * Deletes removed saved photos, uploads new ones, saves a step’s answers with the new URLs, then
 * calls `onSaved`. Shows an error toast when any part fails. `uploadProgress` is set only while
 * the photos upload.
 */
export const useSaveResaleSubmission = ({ onSaved, onPhotosReloaded }: SaveOptions) => {
  const toast = useToast()
  const environment = useRelayEnvironment()
  const { submitMutation } = useUpdateResaleSubmission()
  const { submitMutation: deleteImage } = useDeleteResaleSubmissionImage()
  const [saving, setSaving] = useState(false)
  const [upload, setUpload] = useState<UploadState | null>(null)
  // Uploads that outlive a failed attempt keep reporting, and must not touch the next attempt
  const currentAttempt = useRef<object | null>(null)
  // Set when the saved photos couldn't be confirmed, so the next save reloads them first
  const photosStale = useRef(false)

  const reloadSavedPhotos = (id: string) =>
    fetchQuery<useUpdateResaleSubmissionConditionPhotosQuery>(
      environment,
      conditionPhotosQuery,
      { id },
      { fetchPolicy: "network-only" }
    )
      .toPromise()
      .then((data) => {
        const submission = data?.me?.resaleSubmission
        if (!submission) {
          throw new Error("Resale submission not found")
        }
        onPhotosReloaded?.(toSavedConditionPhotos(submission))
        photosStale.current = false
      })

  /** `getPhotoChanges` is read once any pending reload is done, so it sees the latest photos */
  const save = (
    input: UpdateResaleSubmissionInput,
    getPhotoChanges?: () => ConditionPhotoChanges
  ) => {
    const attempt = {}
    currentAttempt.current = attempt
    const update = (change: (state: UploadState) => UploadState) =>
      setUpload((state) => (currentAttempt.current === attempt && state ? change(state) : state))

    let changedPhotos = false
    setSaving(true)

    const ready =
      getPhotoChanges && photosStale.current ? reloadSavedPhotos(input.id) : Promise.resolve()

    ready
      .then(() => {
        const { photos, savedPhotoIDs } = getPhotoChanges?.() ?? { photos: [], savedPhotoIDs: [] }
        const removedIDs = savedPhotoIDs.filter(
          (id) => !photos.some((photo) => photo.imageID === id)
        )
        const photoPaths = photos.filter((photo) => !photo.imageID).map((photo) => photo.path)
        changedPhotos = removedIDs.length > 0 || photoPaths.length > 0

        setUpload(photoPaths.length > 0 ? { progress: photoPaths.map(() => 0), done: 0 } : null)

        // Every delete settles before the next step, so a reload after a failure sees them all
        return Promise.allSettled(
          removedIDs.map((imageID) =>
            deleteImage({
              variables: { input: { id: input.id, imageID } },
              rejectIf: (response) =>
                response.deleteResaleSubmissionImage?.resaleSubmissionOrError?.__typename !==
                "DeleteResaleSubmissionImageSuccess",
            })
          )
        ).then((results) => {
          if (results.some((result) => result.status === "rejected")) {
            throw new Error("A photo couldn’t be deleted")
          }
          return photoPaths
        })
      })
      .then((photoPaths) =>
        Promise.all(
          photoPaths.map((path, index) =>
            getConvertedImageUrlFromS3(path, (value) =>
              update((state) => ({
                ...state,
                progress: state.progress.map((current, i) => (i === index ? value : current)),
              }))
            ).then((url) => {
              update((state) => ({
                progress: state.progress.map((current, i) => (i === index ? 1 : current)),
                done: state.done + 1,
              }))
              return url
            })
          )
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
      .then(
        (response) => {
          const result = response.updateResaleSubmission?.resaleSubmissionOrError
          const submission =
            result?.__typename === "UpdateResaleSubmissionSuccess" ? result.resaleSubmission : null

          if (!submission && changedPhotos) {
            photosStale.current = true
          }
          onSaved(submission ? toSavedConditionPhotos(submission) : null)
        },
        () => {
          setUpload(null)
          toast.show(SAVE_ERROR, "bottom", { backgroundColor: "red100" })

          if (!getPhotoChanges || !(changedPhotos || photosStale.current)) {
            return
          }

          // Keeps `saving` on until the reload lands, so a quick retry can’t resend saved photos
          return reloadSavedPhotos(input.id).catch(() => {
            photosStale.current = true
          })
        }
      )
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
