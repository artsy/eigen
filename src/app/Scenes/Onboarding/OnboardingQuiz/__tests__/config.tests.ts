import { renderHook } from "@testing-library/react-hooks"
import { State } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import {
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_FOLLOW_GALLERIES_IM_INTERESTED_IN,
  OPTION_TOP_AUCTION_LOTS,
  OPTION_YES_I_LOVE_COLLECTING_ART,
  useConfig,
} from "app/Scenes/Onboarding/OnboardingQuiz/config"

describe("config", () => {
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
            followedIds: [],
          },
        },
      })
    )

    for (let i = 0; i < 3; i++) {
      workflowEngine.next()
    }

    expect(workflowEngine.current()).toEqual("VIEW_QUESTION_THREE")
    expect(workflowEngine.back()).toEqual("VIEW_QUESTION_TWO")
    expect(workflowEngine.back()).toEqual("VIEW_QUESTION_ONE")
    expect(workflowEngine.back()).toEqual("VIEW_WELCOME")
  })

  it("should make a decision", () => {
    const basis = {
      current: {
        questionOne: OPTION_YES_I_LOVE_COLLECTING_ART,
        questionTwo: [OPTION_DEVELOPING_MY_ART_TASTES],
        questionThree: null,
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
})
