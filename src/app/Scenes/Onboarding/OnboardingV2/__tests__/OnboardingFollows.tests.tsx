import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { OnboardingFollowArtists } from "../OnboardingFollowArtists"
import { OnboardingOrderedSetScreen } from "../OnboardingOrderedSet"
import { OnboardingSearchResultsScreen } from "../OnboardingSearchResults"

jest.unmock("react-relay")

jest.mock("app/Scenes/Onboarding/OnboardingV2/Hooks/useOnboardingContext", () => {
  return {
    useOnboardingContext: () => ({
      state: {
        query: "",
        followedIds: [],
      },
    }),
  }
})

jest.mock("shared/hooks/useDebouncedValue", () => {
  return {
    useDebouncedValue: ({ value }: { value: string }) => ({ debouncedValue: value }),
  }
})

describe("OnboardingFollowArtists", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })
  it("should swap backfill with search results", async () => {
    renderWithHookWrappersTL(<OnboardingFollowArtists />, env)
    const input = screen.getByPlaceholderText("Search Artists")

    expect(input).toHaveProp("value", "")

    resolveMostRecentRelayOperation(env)

    expect(screen.UNSAFE_getByType(OnboardingOrderedSetScreen)).toBeTruthy()
    expect(screen.queryByText("Follow artists to see more of their work")).toBeTruthy()

    // title goes away after typing one character but backfill is still rendered
    fireEvent(input, "changeText", "a")
    expect(screen.UNSAFE_getByType(OnboardingOrderedSetScreen)).toBeTruthy()
    expect(screen.queryByText("Follow artists to see more of their work")).toBeNull()

    fireEvent(input, "changeText", "ab")
    expect(input).toHaveProp("value", "ab")

    expect(screen.UNSAFE_getByType(OnboardingSearchResultsScreen)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(OnboardingOrderedSetScreen)).toBeNull()
  })
})
