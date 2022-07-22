import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"

import {
  requestForPriceEstimateMutation,
  RequestForPriceEstimateScreen,
} from "./RequestForPriceEstimateScreen"

describe("RequestForPriceEstimateScreen", () => {
  const props = {
    artworkID: "artworkId",
    artworkSlug: "artworkSlug",
    name: "Tester HQ",
    email: "tester@hq.com",
    phone: "+49123456898",
  }

  it("renders without errors", () => {
    renderWithWrappers(<RequestForPriceEstimateScreen {...props} />)
  })

  describe("requestForPriceEstimateMutation", () => {
    const input = {
      artworkId: "artworkId",
      artworkSlug: "artworkSlug",
      requesterName: "My Name is",
      requesterEmail: "email@email.com",
      requesterPhoneNumber: "+4912345",
    }

    const onCompleted = jest.fn()

    it("sends Request", () => {
      requestForPriceEstimateMutation(getMockRelayEnvironment(), onCompleted, jest.fn(), input)

      resolveMostRecentRelayOperation()

      expect(onCompleted).toBeCalled()
    })
  })
})
