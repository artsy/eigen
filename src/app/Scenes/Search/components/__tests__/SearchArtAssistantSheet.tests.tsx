import { act, fireEvent, screen } from "@testing-library/react-native"
import { FilterArray, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SearchArtAssistantProvider,
  useSearchArtAssistantContext,
} from "app/Scenes/Search/SearchArtAssistantContext"
import { SearchArtAssistantSheet } from "app/Scenes/Search/components/SearchArtAssistantSheet"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { useEffect } from "react"
import { createMockEnvironment } from "relay-test-utils"

// The real sheet draws its handle through native gesture code, so this stand-in renders the handle
// and children directly and lets `snapToIndex` report the new index like a finished snap.
jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react")
  const { View } = require("react-native")
  const bottomSheetMock = require("@gorhom/bottom-sheet/mock")

  const MockBottomSheet = React.forwardRef(
    ({ children, handleComponent: Handle, onChange }: any, ref: any) => {
      // gorhom reports snaps through a callback captured on an early render, so keep the first one.
      const firstOnChange = React.useRef(onChange)

      React.useImperativeHandle(ref, () => ({
        snapToIndex: (index: number) => firstOnChange.current(index),
      }))

      return React.createElement(React.Fragment, null, React.createElement(Handle), children)
    }
  )

  return {
    __esModule: true,
    SCROLLABLE_TYPE: {},
    createBottomSheetScrollableComponent: jest.fn().mockReturnValue(View),
    ...bottomSheetMock,
    default: MockBottomSheet,
  }
})

const SearchSeed: React.FC<{ query: string; filters: FilterArray }> = ({ query, filters }) => {
  const { setQuery, setFilters } = useSearchArtAssistantContext()

  useEffect(() => {
    setQuery(query)
    setFilters(filters)
  }, [query, filters, setQuery, setFilters])

  return null
}

const renderSheet = ({ query = "", filters = [] }: { query?: string; filters?: FilterArray }) => {
  const environment = createMockEnvironment()
  const search = {} as { current: ReturnType<typeof useSearchArtAssistantContext> }

  const SearchHandle: React.FC = () => {
    search.current = useSearchArtAssistantContext()

    return null
  }

  renderWithHookWrappersTL(
    <SearchArtAssistantProvider>
      <SearchSeed query={query} filters={filters} />
      <SearchHandle />
      <SearchArtAssistantSheet />
    </SearchArtAssistantProvider>,
    environment
  )

  return { environment, search }
}

const finishAnswer = async (environment: ReturnType<typeof createMockEnvironment>) => {
  await act(async () => {
    environment.mock.nextValue(environment.mock.getMostRecentOperation(), {
      data: {
        aiAgentTurn: {
          __typename: "AIAgentTurnComplete",
          message: "Here are a few.",
          stopReason: "end_turn",
          toolCallCount: 1,
          artworks: [],
          suggestedReplies: [],
        },
      },
    })
  })
}

describe("SearchArtAssistantSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectState({
      auth: { userID: "user-id", userAccessToken: "access-token" },
    })
  })

  it("shows only the title while collapsed", () => {
    const { environment } = renderSheet({ query: "abstract" })

    expect(screen.getByText("Art Assistant")).toBeOnTheScreen()
    expect(screen.queryByLabelText("Art Assistant prompt")).not.toBeOnTheScreen()
    expect(environment.mock.getAllOperations()).toHaveLength(0)
  })

  it("starts a session with the query and filters when expanded", () => {
    const { environment } = renderSheet({
      query: "abstract",
      filters: [{ displayText: "Blue", paramName: FilterParamName.colors }],
    })

    fireEvent.press(screen.getByLabelText("Open Art Assistant"))

    const prompt = 'Find artworks for "abstract" with these filters: Color: Blue.'

    expect(screen.getByText(prompt)).toBeOnTheScreen()
    expect(environment.mock.getAllOperations()).toHaveLength(1)
    expect(environment.mock.getMostRecentOperation().request.variables.input).toEqual(
      expect.objectContaining({ message: prompt })
    )
  })

  it("tracks the tap that expands the sheet", () => {
    renderSheet({ query: "abstract" })

    fireEvent.press(screen.getByLabelText("Open Art Assistant"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedArtAssistant",
        context_screen_owner_type: "search",
        destination_screen_owner_type: "artAssistant",
        type: "button",
      })
    )
  })

  it("keeps the same session when collapsed and expanded again", () => {
    const { environment } = renderSheet({ query: "abstract" })

    fireEvent.press(screen.getByLabelText("Open Art Assistant"))
    fireEvent.press(screen.getByLabelText("Collapse Art Assistant"))
    fireEvent.press(screen.getByLabelText("Open Art Assistant"))

    expect(screen.getAllByText('Find artworks for "abstract".')).toHaveLength(1)
    expect(environment.mock.getAllOperations()).toHaveLength(1)
  })

  it("does not send anything when there is no query and no filters", () => {
    const { environment } = renderSheet({})

    fireEvent.press(screen.getByLabelText("Open Art Assistant"))

    expect(screen.getByText("What are you looking for?")).toBeOnTheScreen()
    expect(environment.mock.getAllOperations()).toHaveLength(0)
  })

  it("sends a new message under the earlier answer when the query changed", async () => {
    const { environment, search } = renderSheet({ query: "abstract" })

    fireEvent.press(screen.getByLabelText("Open Art Assistant"))
    await finishAnswer(environment)
    fireEvent.press(screen.getByLabelText("Collapse Art Assistant"))

    act(() => search.current.setQuery("blue boats"))
    fireEvent.press(screen.getByLabelText("Open Art Assistant"))

    expect(screen.getByText('Find artworks for "abstract".')).toBeOnTheScreen()
    expect(screen.getByText('Find artworks for "blue boats".')).toBeOnTheScreen()
    expect(environment.mock.getAllOperations()).toHaveLength(1)
    expect(environment.mock.getMostRecentOperation().request.variables.input).toEqual(
      expect.objectContaining({ message: 'Find artworks for "blue boats".' })
    )
  })

  it("sends a new message when only the filters changed", async () => {
    const { environment, search } = renderSheet({ query: "abstract" })

    fireEvent.press(screen.getByLabelText("Open Art Assistant"))
    await finishAnswer(environment)
    fireEvent.press(screen.getByLabelText("Collapse Art Assistant"))

    act(() =>
      search.current.setFilters([{ displayText: "Blue", paramName: FilterParamName.colors }])
    )
    fireEvent.press(screen.getByLabelText("Open Art Assistant"))

    expect(
      screen.getByText('Find artworks for "abstract" with these filters: Color: Blue.')
    ).toBeOnTheScreen()
  })

  it("does not send again when the search did not change", async () => {
    const { environment } = renderSheet({ query: "abstract" })

    fireEvent.press(screen.getByLabelText("Open Art Assistant"))
    await finishAnswer(environment)
    fireEvent.press(screen.getByLabelText("Collapse Art Assistant"))
    fireEvent.press(screen.getByLabelText("Open Art Assistant"))

    expect(screen.getAllByText('Find artworks for "abstract".')).toHaveLength(1)
    expect(environment.mock.getAllOperations()).toHaveLength(0)
  })

  it("sends the search that was typed after opening an empty sheet", () => {
    const { environment, search } = renderSheet({})

    fireEvent.press(screen.getByLabelText("Open Art Assistant"))
    fireEvent.press(screen.getByLabelText("Collapse Art Assistant"))

    act(() => search.current.setQuery("blue boats"))
    fireEvent.press(screen.getByLabelText("Open Art Assistant"))

    expect(screen.getByText('Find artworks for "blue boats".')).toBeOnTheScreen()
    expect(environment.mock.getAllOperations()).toHaveLength(1)
  })

  it("waits for the running answer to finish before sending the changed search", async () => {
    const { environment, search } = renderSheet({ query: "abstract" })

    fireEvent.press(screen.getByLabelText("Open Art Assistant"))
    fireEvent.press(screen.getByLabelText("Collapse Art Assistant"))

    act(() => search.current.setQuery("blue boats"))
    fireEvent.press(screen.getByLabelText("Open Art Assistant"))

    expect(screen.queryByText('Find artworks for "blue boats".')).not.toBeOnTheScreen()

    await finishAnswer(environment)

    expect(screen.getByText('Find artworks for "blue boats".')).toBeOnTheScreen()
  })
})
