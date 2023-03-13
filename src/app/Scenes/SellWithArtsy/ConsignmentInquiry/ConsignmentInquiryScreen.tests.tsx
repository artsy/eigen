import { act } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
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

    const inputWithRecipientEmail = {
      ...otherProps,
      phoneNumber: phone,
      message: "Message to You",
      recipientEmail: "test@artsymail.com",
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

    it("sends Consignment Inquiries with recipientEmail ", () => {
      createConsignmentInquiry(environment, onCompleted, jest.fn(), inputWithRecipientEmail)
      const operation = environment.mock.getMostRecentOperation()
      act(() => {
        environment.mock.resolve(operation, MockPayloadGenerator.generate(operation))
      })
      expect(onCompleted).toBeCalled()
    })
  })
})
