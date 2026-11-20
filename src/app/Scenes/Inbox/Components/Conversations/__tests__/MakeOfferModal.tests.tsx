import { act, fireEvent, screen } from "@testing-library/react-native"
import { MakeOfferModalTestsQuery } from "__generated__/MakeOfferModalTestsQuery.graphql"
import { MakeOfferModalFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/MakeOfferModal"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
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
  renderer: (props: RenderComponentProps) => React.JSX.Element | undefined
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

const renderAndResolve = (mockResolvers = mockResolver, renderer = renderComponent) => {
  renderWithWrappers(<TestRenderer renderer={renderer} />)
  act(() => {
    env.mock.resolveMostRecentOperation((operation) => {
      return MockPayloadGenerator.generate(operation, mockResolvers)
    })
  })
}

/** Presses Confirm and returns the edition set the make offer mutation was sent with. */
const confirmAndGetEditionSetID = () => {
  fireEvent.press(screen.getByText("Confirm"))
  const operation = env.mock.getMostRecentOperation()
  expect(operation.request.node.params.name).toBe("InquiryMakeOfferButtonOrderMutation")
  const editionSetID = operation.request.variables.input.editionSetId

  // Let the mutation finish, so the button accepts the next press.
  act(() => {
    env.mock.resolve(
      operation,
      MockPayloadGenerator.generate(operation, {
        Mutation: () => ({
          createInquiryOfferOrder: {
            orderOrError: {
              __typename: "CommerceOrderWithMutationSuccess",
              order: { internalID: "order-id" },
            },
          },
        }),
      })
    )
  })

  return editionSetID
}

beforeEach(() => {
  env = createMockEnvironment()
})

describe("<MakeOfferModal />", () => {
  it("renders the modal", () => {
    renderAndResolve()
    expect(screen.getByText("Select edition set")).toBeOnTheScreen()
  })
  it("displays the correct artwork", () => {
    renderAndResolve()
    expect(screen.getByText(/^test-artwork/)).toBeOnTheScreen()
  })
  it("doesn't display edition checkboxes and can be confirmed", () => {
    renderAndResolve()
    expect(screen.queryAllByRole("radio")).toHaveLength(0)
    expect(screen.getByText("Confirm")).toBeEnabled()
  })
  // EDITIONS
  describe("when artwork is edition set", () => {
    it("shows edition selection when it's an edition", () => {
      renderAndResolve(mockEditionsResolver)
      expect(screen.getAllByRole("radio")).toHaveLength(3)
    })
    it("disables the confirm button until an edition is selected", () => {
      renderAndResolve(mockEditionsResolver)
      expect(screen.getByText("Confirm")).toBeDisabled()
    })

    it("doesn't disable the confirm button if an editioned work only has one edition", () => {
      renderAndResolve(mockSingleEditionResolver)
      expect(screen.getByText("Confirm")).toBeEnabled()
    })

    it("shows unavailable editions as unavailable and doesn't allow selection", async () => {
      renderAndResolve(mockEditionsResolver)
      expect(screen.getByText("Unavailable")).toBeOnTheScreen()
      expect(screen.queryByText("€200")).not.toBeOnTheScreen()
      fireEvent.press(screen.getByText("Unavailable"))
      await flushPromiseQueue()
      expect(screen.getByText("Confirm")).toBeDisabled()
      // Nothing was selected, so pressing Confirm doesn't create an order.
      fireEvent.press(screen.getByText("Confirm"))
      expect(env.mock.getAllOperations()).toHaveLength(0)
    })
    it("allows the user to toggle between available editions and confirm", async () => {
      renderAndResolve(mockEditionsResolver)
      fireEvent.press(screen.getByText("€100"))
      await flushPromiseQueue()
      expect(screen.getByText("Confirm")).toBeEnabled()
      expect(confirmAndGetEditionSetID()).toBe("edition-1")
      fireEvent.press(screen.getByText("€300"))
      await flushPromiseQueue()
      expect(screen.getByText("Confirm")).toBeEnabled()
      expect(confirmAndGetEditionSetID()).toBe("edition-3")
    })
  })
})
