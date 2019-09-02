import { AsyncStorage } from "react-native"
AsyncStorage.setItem = jest.fn()
AsyncStorage.getItem = jest.fn()
AsyncStorage.removeItem = jest.fn()

import Overview from "../Overview"

jest.mock("@react-native-community/cameraroll", () => jest.fn())
jest.mock("../../Submission/createConsignmentSubmission", () => jest.fn())
jest.mock("../../Submission/update", () => jest.fn())

beforeEach(() => {
  jest.resetAllMocks()
})

const key = "ConsignmentsStoredState"

it("restores when no props are provided", () => {
  // tslint:disable-next-line
  new Overview({ setup: null })
  expect(AsyncStorage.getItem).toBeCalledWith(key, expect.anything())
})

it("does not restore setup props are provided", () => {
  // tslint:disable-next-line
  new Overview({ setup: {} })
  expect(AsyncStorage.getItem).not.toBeCalled()
})

it("updates the local state when there an update is triggered", () => {
  const overview = new Overview({ setup: {} })

  overview.setState = (updated, callback) => {
    overview.state = Object.assign({}, overview.state, updated)
    callback()
  }

  overview.updateProvenance("This is a new provenance")

  expect(AsyncStorage.setItem).toBeCalledWith(
    "ConsignmentsStoredState",
    JSON.stringify({ provenance: "This is a new provenance" })
  )
})

it("resets the cache when a final submission is made", async () => {
  const overview = new Overview({ setup: {} })
  overview.uploadPhotosIfNeeded = () => Promise.resolve()
  overview.showConfirmationScreen = () => true
  overview.setState = jest.fn()

  // Make a call to the
  await overview.submitFinalSubmission()

  expect(AsyncStorage.removeItem).toBeCalledWith(key)
})
