// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { postEventToProviders } from "app/utils/track/providers"
import { shallow } from "enzyme"
import React from "react"

jest.mock("@react-native-community/cameraroll", () => jest.fn())

jest.unmock("react-tracking")

import { Overview } from "./Overview"

const nav = {} as any

beforeEach(jest.resetAllMocks)

it("calls the draft created event", () => {
  const overviewComponent = shallow(
    <Overview
      navigator={nav}
      params={{}}
      setup={{ submissionID: "123" }}
      showActionSheetWithOptions={jest.fn()}
    />
  ).dive()
  const overview = overviewComponent.dive().instance()

  overview.submissionDraftCreated()
  expect(postEventToProviders).toBeCalledWith({
    action_name: "consignmentDraftCreated",
    action_type: "success",
    context_screen: "ConsignmentsOverview",
    context_screen_owner_type: "ConsignmentSubmission",
    owner_id: "123",
    owner_slug: "123",
    owner_type: "ConsignmentSubmission",
  })
})

it("calls the draft created event", () => {
  const overviewComponent = shallow(
    <Overview
      navigator={nav}
      params={{}}
      setup={{ submissionID: "123" }}
      showActionSheetWithOptions={jest.fn()}
    />
  ).dive()
  const overview = overviewComponent.dive().instance()

  overview.submissionDraftSubmitted()
  expect(postEventToProviders).toBeCalledWith({
    action_name: "consignmentSubmitted",
    action_type: "success",
    context_screen: "ConsignmentsOverview",
    context_screen_owner_type: "ConsignmentSubmission",
    owner_id: "123",
    owner_slug: "123",
    owner_type: "ConsignmentSubmission",
  })
})
