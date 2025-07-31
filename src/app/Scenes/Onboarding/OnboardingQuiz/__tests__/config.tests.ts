import { renderHook } from "@testing-library/react-hooks"
import { State } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import {
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_FOLLOW_GALLERIES_IM_INTERESTED_IN,
  OPTION_TOP_AUCTION_LOTS,
  OPTION_YES_I_LOVE_COLLECTING_ART,
  useConfig,
} from "app/Scenes/Onboarding/OnboardingQuiz/config"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"

describe("config", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      ARShowOnboardingPriceRangeScreen: true,
    })
  })

  it("should move forward through workflow", () => {
    const {
      result: {
        current: { workflowEngine },
      },
    } = renderHook(() =>
      useConfig({
        onDone: jest.fn(),
        basis: {
          current: {
            questionOne: OPTION_YES_I_LOVE_COLLECTING_ART,
            questionTwo: [OPTION_DEVELOPING_MY_ART_TASTES],
            questionThree: OPTION_TOP_AUCTION_LOTS,
            priceRange: null,
            followedIds: [],
          },
        },
      })
    )

    expect(workflowEngine.current()).toEqual("VIEW_WELCOME")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_ONE")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_TWO")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_THREE")
    expect(workflowEngine.next()).toEqual("VIEW_TOP_AUCTION_LOTS")
  })

  it("should move backward through workflow", () => {
    const {
      result: {
        current: { workflowEngine },
      },
    } = renderHook(() =>
      useConfig({
        onDone: jest.fn(),
        basis: {
          current: {
            questionOne: OPTION_YES_I_LOVE_COLLECTING_ART,
            questionTwo: [OPTION_DEVELOPING_MY_ART_TASTES],
            questionThree: OPTION_TOP_AUCTION_LOTS,
            priceRange: null,
            followedIds: [],
          },
        },
      })
    )

    // Test the linear part of the workflow where index should increment properly
    expect(workflowEngine.current()).toEqual("VIEW_WELCOME")
    expect(workflowEngine.index).toEqual(0)

    // Move to question one
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_ONE")
    expect(workflowEngine.index).toEqual(1)

    // Move to question two
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_TWO")
    expect(workflowEngine.index).toEqual(2)

    // Now test backward navigation through the linear parts
    expect(workflowEngine.back()).toEqual("VIEW_QUESTION_ONE")
    expect(workflowEngine.index).toEqual(1)

    expect(workflowEngine.back()).toEqual("VIEW_WELCOME")
    expect(workflowEngine.index).toEqual(0)
    expect(workflowEngine.isStart()).toBe(true)
    expect(workflowEngine.current()).toEqual("VIEW_WELCOME")
  })

  it("should make a decision", () => {
    const basis = {
      current: {
        questionOne: OPTION_YES_I_LOVE_COLLECTING_ART,
        questionTwo: [OPTION_DEVELOPING_MY_ART_TASTES],
        questionThree: null,
        priceRange: null,
        followedIds: [],
      } as State,
    }
    const {
      result: {
        current: { workflowEngine },
      },
    } = renderHook(() => useConfig({ onDone: jest.fn(), basis }))

    expect(workflowEngine.current()).toEqual("VIEW_WELCOME")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_ONE")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_TWO")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_THREE")
    basis.current.questionThree = OPTION_FOLLOW_GALLERIES_IM_INTERESTED_IN
    expect(workflowEngine.next()).toEqual("VIEW_FOLLOW_GALLERIES")
  })

  it("should show price range screen for budget-related options", () => {
    const basis = {
      current: {
        questionOne: OPTION_YES_I_LOVE_COLLECTING_ART,
        questionTwo: [OPTION_FINDING_GREAT_INVESTMENTS],
        questionThree: OPTION_TOP_AUCTION_LOTS,
        priceRange: null,
        followedIds: [],
      } as State,
    }
    const {
      result: {
        current: { workflowEngine },
      },
    } = renderHook(() => useConfig({ onDone: jest.fn(), basis }))

    expect(workflowEngine.current()).toEqual("VIEW_WELCOME")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_ONE")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_TWO")
    expect(workflowEngine.next()).toEqual("VIEW_PRICE_RANGE")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_THREE")
  })

  it("should skip price range screen for non-budget options", () => {
    const basis = {
      current: {
        questionOne: OPTION_YES_I_LOVE_COLLECTING_ART,
        questionTwo: [OPTION_DEVELOPING_MY_ART_TASTES],
        questionThree: OPTION_TOP_AUCTION_LOTS,
        priceRange: null,
        followedIds: [],
      } as State,
    }
    const {
      result: {
        current: { workflowEngine },
      },
    } = renderHook(() => useConfig({ onDone: jest.fn(), basis }))

    expect(workflowEngine.current()).toEqual("VIEW_WELCOME")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_ONE")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_TWO")
    expect(workflowEngine.next()).toEqual("VIEW_QUESTION_THREE")
  })
})
