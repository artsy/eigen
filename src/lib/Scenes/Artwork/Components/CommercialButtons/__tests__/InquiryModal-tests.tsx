jest.mock("../../../../../utils/googleMaps", () => ({ queryLocation: jest.fn() }))

import { InquiryModalTestsQuery } from "__generated__/InquiryModalTestsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Input } from "lib/Components/Input/Input"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { queryLocation } from "lib/utils/googleMaps"
import { Touchable } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { InquiryModalFragmentContainer } from "../InquiryModal"
import { LocationAutocomplete } from "../LocationAutocomplete"
import { ShippingModal } from "../ShippingModal"

jest.unmock("react-relay")

let env: ReturnType<typeof createMockEnvironment>

// TODO: add the other modal props
const modalProps = {
  modalIsVisible: true,
  toggleVisibility: jest.fn(),
}

const TestRenderer = () => (
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
    render={({ props, error }) => {
      if (Boolean(props?.artwork)) {
        return <InquiryModalFragmentContainer artwork={props!.artwork!} {...modalProps} />
      } else if (Boolean(error)) {
        console.log(error)
      }
    }}
  />
)

const getWrapper = (
  mockResolvers = {
    Artwork: () => ({
      inquiryQuestions: [{ question: "Shipping" }],
    }),
  }
) => {
  const tree = renderWithWrappers(<TestRenderer />)
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

const press = (ti: ReactTestInstance, text: string) => {
  const touchable = ti.findAllByType(Touchable).filter((t) => extractText(t) === text)[0]
  expect(touchable).toBeTruthy()
  act(() => {
    touchable.props.onPress()
  })
}

describe("<InquiryModal />", () => {
  it("renders the modal", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("What information are you looking for?")
  })

  describe("adding a location", () => {
    it("user can visit shipping modal", () => {
      const wrapper = getWrapper()
      expect(extractText(wrapper.root)).toContain("Add your location")
      expect(wrapper.root.findByType(ShippingModal).props.modalIsVisible).toBeFalsy()

      press(wrapper.root, "Add your location")

      expect(wrapper.root.findByType(ShippingModal).props.modalIsVisible).toBeTruthy()
      const header = wrapper.root.findByType(ShippingModal).findByType(FancyModalHeader)
      expect(extractText(header)).toContain("Add Location")
    })

    it("updates with location search suggestions from google", async () => {
      ;(queryLocation as jest.Mock).mockResolvedValue([
        { id: "a", name: "Coxsackie, NY, USA" },
        { id: "b", name: "Coxs Creek, KY, USA" },
      ])
      const wrapper = getWrapper()
      press(wrapper.root, "Add your location")

      const locationModal = wrapper.root.findByType(LocationAutocomplete)
      const locationInput = locationModal.findByType(Input)
      await act(async () => {
        locationInput.props.onChangeText("Cox")
        await flushPromiseQueue()
      })

      expect(extractText(wrapper.root)).toContain("Coxsackie, NY, USA")
    })
  })
})
