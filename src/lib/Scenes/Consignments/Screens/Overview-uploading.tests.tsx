import AsyncStorage from "@react-native-async-storage/async-storage"
AsyncStorage.setItem = jest.fn()
AsyncStorage.getItem = jest.fn()
AsyncStorage.removeItem = jest.fn()

import { Overview } from "./Overview"

jest.mock("../Submission/updateConsignmentSubmission", () => ({
  updateConsignmentSubmission: jest.fn(),
}))
import { updateConsignmentSubmission } from "../Submission/updateConsignmentSubmission"

jest.mock("../Submission/uploadPhotoToGemini", () => ({ uploadImageAndPassToGemini: jest.fn() }))
import { uploadImageAndPassToGemini } from "../Submission/uploadPhotoToGemini"

const nav = {} as any
const route = {} as any

beforeEach(jest.resetAllMocks)

it("does nothing when there's no photos in setup", () => {
  const overview = new Overview({ nav, route, setup: {}, params: {} })
  overview.uploadPhotosIfNeeded()
  expect(uploadImageAndPassToGemini).not.toBeCalled()
})

it("uploads a photo when there's an photo without upload as true", () => {
  const overview = new Overview({
    nav,
    route,
    setup: { submissionID: 1, photos: [{ image: { path: "/a/b/c.webp" }, uploaded: false }] },
    params: {},
  })
  overview.setState = jest.fn()
  overview.uploadPhotosIfNeeded()
  expect(uploadImageAndPassToGemini).toBeCalledWith("/a/b/c.webp", "private", 1)
})

it("doesnt upload a photo when when uploading is true", () => {
  const photos = [
    { image: { path: "/a/b/c.webp" }, uploaded: false, uploading: true },
    { image: { path: "/a/b/d.webp" }, uploaded: false, uploading: false },
  ]
  const overview = new Overview({
    nav,
    route,
    setup: { submission_id: 1, photos },
    params: {},
  })
  overview.uploadPhotosIfNeeded()
  expect(uploadImageAndPassToGemini).not.toBeCalled()
})

it("calls update submission when submitting a non-draft version", () => {
  const overview = new Overview({ nav, route, setup: { submissionID: "123" }, params: {} })
  overview.setState = jest.fn()
  overview.showConfirmationScreen = () => void overview.submitFinalSubmission()

  overview.submitFinalSubmission()
  expect(updateConsignmentSubmission).toBeCalledWith({ state: "SUBMITTED", submissionID: "123" })
})

it("passes utm params when submitting", () => {
  const overview = new Overview({
    nav,
    route,
    setup: { submissionID: "123" },
    params: { utm_term: "some-term", utm_source: "some-source", utm_medium: "some-medium" },
  })
  overview.setState = jest.fn()
  overview.showConfirmationScreen = () => void overview.submitFinalSubmission()

  overview.submitFinalSubmission()
  expect(updateConsignmentSubmission).toBeCalledWith({
    state: "SUBMITTED",
    submissionID: "123",
    utmTerm: "some-term",
    utmSource: "some-source",
    utmMedium: "some-medium",
  })
})
