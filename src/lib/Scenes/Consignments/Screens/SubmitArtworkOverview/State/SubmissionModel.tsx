import { Action, action } from "easy-peasy"
import { ConsignmentsSubmissionUtmParams } from "../../../ConsignmentsHome/ConsignmentsSubmissionForm"

export interface SubmissionForm {
  id: string
  artistName: string
  artistID: string
  year: string
  title: string
  medium: string
  attributionClass: string
  editionNumber: string
  editionSizeFormatted: string
  height: string
  width: string
  depth: string
  dimensionsMetric: string
  provenance: string
  locationCity: string
  locationState: string
  locationCountry: string
  state: string
  utmMedium: string | undefined
  utmSource: string | undefined
  utmTerm: string | undefined
}

export interface ArtworkSubmissionModel {
  submissionForm: SubmissionForm
  setSubmissionForm: Action<ArtworkSubmissionModel, SubmissionForm>
  setUtmParams: Action<ArtworkSubmissionModel, ConsignmentsSubmissionUtmParams>
  resetSessionState: Action<ArtworkSubmissionModel>
}

export const ArtworkSubmissionModel: ArtworkSubmissionModel = {
  submissionForm: {
    id: "",
    artistName: "",
    artistID: "",
    year: "",
    title: "",
    medium: "",
    attributionClass: "",
    editionNumber: "",
    editionSizeFormatted: "",
    height: "",
    width: "",
    depth: "",
    dimensionsMetric: "",
    provenance: "",
    locationCity: "",
    locationState: "",
    locationCountry: "",
    state: "",
    utmMedium: "",
    utmSource: "",
    utmTerm: "",
  },
  setSubmissionForm: action((state, submissionForm) => {
    state.submissionForm = submissionForm
  }),
  setUtmParams: action((state, params) => {
    state.submissionForm = {
      ...state.submissionForm,
      utmMedium: params.utm_medium,
      utmSource: params.utm_source,
      utmTerm: params.utm_term,
    }
  }),
  resetSessionState: action((state) => {
    state.submissionForm = {
      id: "",
      artistName: "",
      artistID: "",
      year: "",
      title: "",
      medium: "",
      attributionClass: "",
      editionNumber: "",
      editionSizeFormatted: "",
      height: "",
      width: "",
      depth: "",
      dimensionsMetric: "",
      provenance: "",
      locationCity: "",
      locationState: "",
      locationCountry: "",
      state: "",
      utmMedium: "",
      utmSource: "",
      utmTerm: "",
    }
  }),
}

export interface SubmissionModel {
  submission: ArtworkSubmissionModel
}

export const getSubmissionSubmissionModel = (): SubmissionModel => ({
  submission: ArtworkSubmissionModel,
})
