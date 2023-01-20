import { act } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ConsignmentInquiryScreen, createConsignmentInquiry } from "./ConsignmentInquiryScreen"

describe("ConsignmentInquiryScreen", () => {
  const props = {
    userId: "user-id",
    name: "Tester HQ",
    email: "tester@hq.com",
    phone: "+49123456898",
  }

  it("renders without errors", () => {
    renderWithWrappers(<ConsignmentInquiryScreen {...props} />)
  })

  describe("createConsignmentInquiry", () => {
    const { phone, ...otherProps } = props
    const input = {
      ...otherProps,
      phoneNumber: phone,
      message: "Message to You",
    }

    const environment = createMockEnvironment()

    const onCompleted = jest.fn()

    it("sends Consignment Inquiries", () => {
      createConsignmentInquiry(environment, onCompleted, jest.fn(), input)
      const operation = environment.mock.getMostRecentOperation()
      act(() => {
        environment.mock.resolve(operation, MockPayloadGenerator.generate(operation))
      })
      expect(onCompleted).toBeCalled()
    })
  })
})
