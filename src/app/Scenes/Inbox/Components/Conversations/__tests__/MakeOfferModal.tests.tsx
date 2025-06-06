import { MakeOfferModalTestsQuery } from "__generated__/MakeOfferModalTestsQuery.graphql"
import { CollapsibleArtworkDetails } from "app/Scenes/Artwork/Components/CommercialButtons/CollapsibleArtworkDetails"
import { EditionSelectBox } from "app/Scenes/Inbox/Components/Conversations/EditionSelectBox"
import { InquiryMakeOfferButton } from "app/Scenes/Inbox/Components/Conversations/InquiryMakeOfferButton"
import { MakeOfferModalFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/MakeOfferModal"
import { extractText } from "app/utils/tests/extractText"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

let env: ReturnType<typeof createMockEnvironment>

const FakeApp = (props: MakeOfferModalTestsQuery["response"]) => {
  return (
    <MakeOfferModalFragmentContainer
      artwork={props!.artwork!}
      conversationID="test-conversation-id"
    />
  )
}

interface RenderComponentProps {
  props: MakeOfferModalTestsQuery["response"] | null
  error: Error | null
}

const renderComponent = ({ props, error }: RenderComponentProps) => {
  if (props?.artwork) {
    return <FakeApp {...props} />
  } else if (error) {
    console.log(error)
  }
}

interface TestRenderProps {
  renderer: (props: RenderComponentProps) => JSX.Element | undefined
}

const TestRenderer = ({ renderer }: TestRenderProps) => {
  return (
    <QueryRenderer<MakeOfferModalTestsQuery>
      environment={env}
      query={graphql`
        query MakeOfferModalTestsQuery @relay_test_operation {
          artwork(id: "pumpkins") {
            ...MakeOfferModal_artwork
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
    title: "test-artwork",
  }),
}

const mockEditionsResolver = {
  Artwork: () => ({
    title: "test-editions-artwork",
    isEdition: true,
    editionSets: [
      {
        internalID: "edition-1",
        isOfferableFromInquiry: true,
        listPrice: {
          display: "€100",
        },
      },
      {
        internalID: "edition-2",
        isOfferableFromInquiry: false,
        listPrice: {
          display: "€200",
        },
      },
      {
        internalID: "edition-3",
        isOfferableFromInquiry: true,
        listPrice: {
          display: "€300",
        },
      },
    ],
  }),
}

const mockSingleEditionResolver = {
  Artwork: () => ({
    title: "test-single-edition-artwork",
    isEdition: true,
    editionSets: [
      {
        internalID: "edition-1",
        isOfferableFromInquiry: true,
        listPrice: {
          display: "€100",
        },
      },
    ],
  }),
}

const getWrapper = (mockResolvers = mockResolver, renderer = renderComponent) => {
  const tree = renderWithWrappersLEGACY(<TestRenderer renderer={renderer} />)
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

describe("<MakeOfferModal />", () => {
  it("renders the modal", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Select edition set")
  })
  it("displays the correct artwork", () => {
    const wrapper = getWrapper()
    const details = wrapper.root.findByType(CollapsibleArtworkDetails)
    expect(details.props.artwork.title).toBe("test-artwork")
  })
  it("doesn't display edition checkboxes and can be confirmed", () => {
    const wrapper = getWrapper()
    const confirmBtn = wrapper.root.findByType(InquiryMakeOfferButton)
    const editions = wrapper.root.findAllByType(EditionSelectBox)
    expect(editions).toHaveLength(0)
    expect(confirmBtn.props.disabled).not.toBeTruthy()
  })
  // EDITIONS
  describe("when artwork is edition set", () => {
    const tapOn = (edition: ReactTestInstance) => {
      edition.props.onPress(
        edition.props.editionSet.internalID,
        edition.props.editionSet.isOfferableFromInquiry
      )
    }
    it("shows edition selection when it's an edition", () => {
      const wrapper = getWrapper(mockEditionsResolver)
      const editions = wrapper.root.findAllByType(EditionSelectBox)
      expect(editions).toHaveLength(3)
    })
    it("disables the confirm button until an edition is selected", () => {
      const wrapper = getWrapper(mockEditionsResolver)
      const confirmBtn = wrapper.root.findByType(InquiryMakeOfferButton)
      expect(confirmBtn.props.disabled).toBeTruthy()
    })

    it("doesn't disable the confirm button if an editioned work only has one edition", () => {
      const wrapper = getWrapper(mockSingleEditionResolver)
      const confirmBtn = wrapper.root.findByType(InquiryMakeOfferButton)
      expect(confirmBtn.props.disabled).toBeFalsy()
    })

    it("shows unavailable editions as unavailable and doesn't allow selection", async () => {
      const wrapper = getWrapper(mockEditionsResolver)
      const selection = wrapper.root
        .findAllByType(EditionSelectBox)
        .find((edtn) => edtn.props.editionSet.internalID === "edition-2")!
      const text = extractText(selection)
      expect(text).toContain("Unavailable")
      expect(text).not.toContain("€200")
      tapOn(selection)
      await flushPromiseQueue()
      const confirmBtn = wrapper.root.findByType(InquiryMakeOfferButton)
      expect(confirmBtn.props.disabled).toBeTruthy()
      expect(confirmBtn.props.editionSetID).toBeNull()
    })
    it("allows the user to toggle between available editions and confirm", async () => {
      const wrapper = getWrapper(mockEditionsResolver)
      const editions = wrapper.root.findAllByType(EditionSelectBox)
      const selection = editions.find((edtn) => edtn.props.editionSet.internalID === "edition-1")!
      const selectionAlt = editions.find(
        (edtn) => edtn.props.editionSet.internalID === "edition-3"
      )!
      tapOn(selection)
      const confirmBtn = wrapper.root.findByType(InquiryMakeOfferButton)
      await flushPromiseQueue()
      expect(confirmBtn.props.disabled).not.toBeTruthy()
      expect(confirmBtn.props.editionSetID).toBe("edition-1")
      tapOn(selectionAlt)
      await flushPromiseQueue()
      expect(confirmBtn.props.disabled).not.toBeTruthy()
      expect(confirmBtn.props.editionSetID).toBe("edition-3")
    })
  })
})
