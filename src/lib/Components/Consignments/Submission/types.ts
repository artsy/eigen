/**
 * This is represented somewhere in the graphQL schema, could that be used?
 */

export interface MetaphysicsSubmission {
  artist_id: string
  authenticity_certificate?: boolean
  category?:
    | "PAINTING"
    | "SCULPTURE"
    | "PHOTOGRAPHY"
    | "PRINT"
    | "DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER"
    | "MIXED_MEDIA"
    | "PERFORMANCE_ART"
    | "INSTALLATION"
    | "VIDEO_FILM_ANIMATION"
    | "ARCHITECTURE"
    | "FASHION_DESIGN_AND_WEARABLE_ART"
    | "JEWELRY"
    | "DESIGN_DECORATIVE_ART"
    | "TEXTILE_ARTS"
    | "OTHER"
  depth?: string
  dimensions_metric?: "CM" | "IN"
  edition?: string
  edition_number?: string
  edition_size?: string
  height?: string
  location_city?: string
  location_country?: string
  location_state?: string
  medium?: string
  provenance?: string
  signature?: boolean
  state?: "DRAFT" | "SUBMITTED"
  title?: string
  width?: string
  year?: string
  clientMutationId: string
  internalID?: string
}

export interface CreateSubmissionResponse {
  data: {
    createConsignmentSubmission: {
      consignment_submission: MetaphysicsSubmission
    }
  }
}

export interface UpdateSubmissionResponse {
  data: {
    updateConsignmentSubmission: {
      consignment_submission: MetaphysicsSubmission
    }
  }
}
