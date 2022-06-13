jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

import { InquiryModalTestsQuery } from "__generated__/InquiryModalTestsQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { extractText } from "app/tests/extractText"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import {
  ArtworkInquiryContext,
  ArtworkInquiryStateProvider,
} from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import React from "react"
import { TextInput } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { press } from "./helpers"
import { InquiryModalFragmentContainer } from "./InquiryModal"
import { ShippingModal } from "./ShippingModal"

jest.unmock("react-relay")

let env: ReturnType<typeof createMockEnvironment>

const toggleVisibility = jest.fn()
const onMutationSuccessful = jest.fn()

// An app shell that holds modal visibility properties
const FakeApp = (props: InquiryModalTestsQuery["response"]) => {
  const [modalIsVisible, setModalIsVisible] = React.useState(true)
  toggleVisibility.mockImplementation(() => setModalIsVisible(!modalIsVisible))
  const modalProps = {
    modalIsVisible,
    toggleVisibility,
    onMutationSuccessful,
  }

  return (
    <InquiryModalFragmentContainer
      artwork={props!.artwork!}
      modalIsVisible={modalProps.modalIsVisible}
      toggleVisibility={modalProps.toggleVisibility}
      onMutationSuccessful={modalProps.onMutationSuccessful}
    />
  )
}

interface RenderComponentProps {
  props: InquiryModalTestsQuery["response"] | null
  error: Error | null
}

const renderComponent = ({ props, error }: RenderComponentProps) => {
  if (props?.artwork) {
    return (
      <ArtworkInquiryStateProvider>
        <FakeApp {...props} />
      </ArtworkInquiryStateProvider>
    )
  } else if (error) {
    console.log(error)
  }
}

const initialState = {
  shippingLocation: null,
  inquiryType: null,
  message: null,
  inquiryQuestions: [],
}

const mockDispatch = jest.fn()

const renderComponentWithMockDispatch = ({ props, error }: RenderComponentProps) => {
  if (props?.artwork) {
    return (
      <ArtworkInquiryContext.Provider value={{ state: initialState, dispatch: mockDispatch }}>
        <FakeApp {...props} />
      </ArtworkInquiryContext.Provider>
    )
  } else if (error) {
    console.log(error)
  }
}

interface TestRenderProps {
  renderer: (props: RenderComponentProps) => JSX.Element | undefined
}

const TestRenderer = ({ renderer }: TestRenderProps) => {
  return (
    <QueryRenderer<InquiryModalTestsQuery>
      environment={env}
      query={graphql`
        query InquiryModalTestsQuery @relay_test_operation {
          artwork(id: "pumpkins") {
            ...InquiryModal_artwork
          }
        }
      `}
      variables={{}}
      render={renderer}
    />
  )
}

const mockResolver = {
  Artwork: () => ({
    inquiryQuestions: [
      { internalID: "price_and_availability", question: "Price & Availability" },
      { internalID: "shipping_quote", question: "Shipping" },
      { internalID: "condition_and_provenance", question: "Condition & Provance" },
    ],
  }),
}

const getWrapper = (mockResolvers = mockResolver, renderer = renderComponent) => {
  const tree = renderWithWrappers(<TestRenderer renderer={renderer} />)
  act(() => {
    env.mock.resolveMostRecentOperation((operation) => {
      return MockPayloadGenerator.generate(operation, mockResolvers)
    })
  })
  return tree
}

beforeEach(() => {
  env = createMockEnvironment()
})

describe("<InquiryModal />", () => {
  it("renders the modal", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("What information are you looking for?")
  })

  it("state resets when exiting and re-entering the modal", async () => {
    const wrapper = getWrapper(mockResolver, renderComponent)
    expect(wrapper.root.findByType(InquiryModalFragmentContainer).props.modalIsVisible).toBeTruthy()
    const checkBox = wrapper.root.findByProps({ testID: "checkbox-shipping_quote" })
    const input = wrapper.root.findByType(TextInput)
    checkBox.props.onPress()
    await flushPromiseQueue()
    expect(checkBox.props.checked).toBeTruthy()
    wrapper.root.findByProps({ testID: "checkbox-shipping_quote" }).props.onPress()
    const testMessage = "Test Message"
    input.props.onChangeText(testMessage)
    expect(input.props.value).toBe(testMessage)
    await press(wrapper.root, { text: "Cancel" })

    expect(wrapper.root.findByType(InquiryModalFragmentContainer).props.modalIsVisible).toBeFalsy()
    expect(checkBox.props.checked).toBeFalsy()
    expect(input.props.value).toBeFalsy()
  })

  describe("user can select 'Price & Availability'", () => {
    it.todo("user taps checkbox and option is selected")
  })

  describe("user can select 'Condition & Provenance'", () => {
    it("user taps checkbox and option is selected", () => {
      const wrapper = getWrapper(mockResolver, renderComponentWithMockDispatch)
      wrapper.root.findByProps({ testID: "checkbox-condition_and_provenance" }).props.onPress()

      expect(mockDispatch).toBeCalledWith({
        payload: {
          details: null,
          isChecked: true,
          questionID: "condition_and_provenance",
        },
        type: "selectInquiryQuestion",
      })
    })
  })

  describe("when submiting an inquiry", () => {
    it("it shows error message on failed inquiry", async () => {
      const wrapper = getWrapper()
      wrapper.root.findByProps({ testID: "checkbox-shipping_quote" }).props.onPress()
      press(wrapper.root, { text: "Send" })
      env.mock.rejectMostRecentOperation(new Error())
      await flushPromiseQueue()
      expect(extractText(wrapper.root)).toContain("Sorry, we were unable to send this message")
    })
  })

  describe("user can select Shipping", () => {
    it("user selecting shipping exposes the 'Add your location' CTA", () => {
      const wrapper = getWrapper()
      wrapper.root.findByProps({ testID: "checkbox-shipping_quote" }).props.onPress()

      expect(extractText(wrapper.root)).toContain("Add your location")
    })

    it("user can visit shipping modal", async () => {
      const wrapper = getWrapper()
      wrapper.root.findByProps({ testID: "checkbox-shipping_quote" }).props.onPress()

      expect(extractText(wrapper.root)).toContain("Add your location")
      expect(wrapper.root.findByType(ShippingModal).props.modalIsVisible).toBeFalsy()

      await press(wrapper.root, { text: /^Add your location/ })

      expect(wrapper.root.findByType(ShippingModal).props.modalIsVisible).toBeTruthy()
      const header = wrapper.root.findByType(ShippingModal).findByType(FancyModalHeader)
      expect(extractText(header)).toContain("Add Location")
    })
  })

  describe("user can input a custom message", () => {
    it("message is typed in", () => {
      const testString = "Test message"
      const wrapper = getWrapper(mockResolver, renderComponentWithMockDispatch)
      wrapper.root.findByType(TextInput).props.onChangeText(testString)

      expect(mockDispatch).toBeCalledWith({
        payload: testString,
        type: "setMessage",
      })
    })
  })
})

// replace testID with testID
