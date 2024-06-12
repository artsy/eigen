import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  ArtworkDetailsCompleted,
  ConsignmentSubmitted,
  ContactInformationCompleted,
  SubmitAnotherArtwork,
  UploadPhotosCompleted,
  ViewArtworkMyCollection,
} from "@artsy/cohesion/dist/Schema/Events/Consignments"
import { ToggledAccordion } from "@artsy/cohesion/dist/Schema/Events/UserExperienceInteractions"

type SubmissionEvent<T> = (
  submissionId: string,
  userEmail?: string | null,
  userId?: string | null
) => T

export const artworkDetailsCompletedEvent: SubmissionEvent<ArtworkDetailsCompleted> = (
  ...rest
) => ({
  action: ActionType.artworkDetailsCompleted,
  context_owner_type: OwnerType.consignmentFlow,
  context_module: ContextModule.artworkDetails,
  ...eventPayload(...rest),
})

export const uploadPhotosCompletedEvent: SubmissionEvent<UploadPhotosCompleted> = (...rest) => ({
  action: ActionType.uploadPhotosCompleted,
  context_owner_type: OwnerType.consignmentFlow,
  context_module: ContextModule.uploadPhotos,
  ...eventPayload(...rest),
})

export const contactInformationCompletedEvent: SubmissionEvent<ContactInformationCompleted> = (
  ...rest
) => ({
  action: ActionType.contactInformationCompleted,
  context_owner_type: OwnerType.consignmentFlow,
  context_module: ContextModule.contactInformation,
  ...eventPayload(...rest),
})

export const consignmentSubmittedEvent: SubmissionEvent<ConsignmentSubmitted> = (...rest) => ({
  action: ActionType.consignmentSubmitted,
  context_owner_type: OwnerType.consignmentFlow,
  context_module: ContextModule.contactInformation,
  fieldsProvided: [],
  ...eventPayload(...rest),
})

export const submitAnotherArtworkEvent: SubmissionEvent<SubmitAnotherArtwork> = (...rest) => ({
  action: ActionType.submitAnotherArtwork,
  context_owner_type: OwnerType.consignmentSubmission,
  ...eventPayload(...rest),
})

export const viewArtworkMyCollectionEvent: SubmissionEvent<ViewArtworkMyCollection> = (
  ...rest
) => ({
  action: ActionType.viewArtworkMyCollection,
  context_owner_type: OwnerType.consignmentSubmission,
  ...eventPayload(...rest),
})

export const toggledAccordionEvent = (
  submissionId: string,
  contextModule: ContextModule,
  subject: string,
  expand: boolean
): ToggledAccordion => ({
  action: ActionType.toggledAccordion,
  context_owner_type: OwnerType.consignmentFlow,
  context_module: contextModule,
  context_owner_id: submissionId,
  subject,
  expand,
})

const eventPayload = (submissionId: string, userEmail?: string | null, userId?: string | null) => ({
  submission_id: submissionId,
  user_email: userEmail || "",
  user_id: userId || undefined,
})
