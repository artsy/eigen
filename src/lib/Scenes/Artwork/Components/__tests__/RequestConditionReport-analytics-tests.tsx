import { Button } from "@artsy/palette"
import { mount } from "enzyme"
import Event from "lib/NativeModules/Events"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { mockTracking } from "lib/tests/mockTracking"
import React from "react"

jest.unmock("react-tracking")

import { RequestConditionReport } from "../RequestConditionReport"

jest.mock("lib/NativeModules/Events", () => ({ postEvent: jest.fn() }))

const artwork = {
  internalID: "some-internal-id",
  slug: "pablo-picasso-guernica",
  saleArtwork: {
    internalID: "some-sale-internal-id",
  },
} as any
const me = {
  email: "someemail@testerino.net",
  internalID: "some-id",
} as any

beforeEach(jest.resetAllMocks)

it("tracks request condition report tapped", () => {
  const RequestConditionReportTracking = mockTracking(() => <RequestConditionReport artwork={artwork} me={me} />)
  const requestConditionReportComponent = mount(<RequestConditionReportTracking />)

  const requestReportButton = requestConditionReportComponent.find(Button).at(0)
  requestReportButton.props().onPress()
  expect(Event.postEvent).toBeCalledWith({
    action_name: "requestConditionReport",
    action_type: "tap",
    context_module: "ArtworkDetails",
  })
})

it("tracks request condition report success", async () => {
  const RequestConditionReportTracking = mockTracking(() => <RequestConditionReport artwork={artwork} me={me} />)
  const trackingComponent = mount(<RequestConditionReportTracking />)

  const requestConditionReportComponent = trackingComponent.find("RequestConditionReport")
  requestConditionReportComponent.instance().requestConditionReport = jest
    .fn()
    .mockReturnValue(Promise.resolve({ requestConditionReport: true }))
  requestConditionReportComponent.update()
  const requestReportButton = requestConditionReportComponent.find(Button).at(0)
  requestReportButton.props().onPress()

  await flushPromiseQueue()

  expect(Event.postEvent).toBeCalledWith({
    action_name: "requestConditionReport",
    action_type: "success",
    context_module: "ArtworkDetails",
  })
})

it("tracks request condition report failure", async () => {
  const RequestConditionReportTracking = mockTracking(() => <RequestConditionReport artwork={artwork} me={me} />)
  const trackingComponent = mount(<RequestConditionReportTracking />)

  const requestConditionReportComponent = trackingComponent.find("RequestConditionReport")
  requestConditionReportComponent.instance().requestConditionReport = jest.fn().mockReturnValue(Promise.reject())
  requestConditionReportComponent.update()
  const requestReportButton = requestConditionReportComponent.find(Button).at(0)
  requestReportButton.props().onPress()

  await flushPromiseQueue()

  expect(Event.postEvent).toBeCalledWith({
    action_name: "requestConditionReport",
    action_type: "fail",
    context_module: "ArtworkDetails",
  })
})
