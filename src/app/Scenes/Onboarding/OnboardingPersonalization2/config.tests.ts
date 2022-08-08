import { renderHook } from "@testing-library/react-hooks"
import {
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_FOLLOW_GALLERIES_I_LOVE,
  OPTION_TOP_AUCTION_LOTS,
  OPTION_YES_I_LOVE_COLLECTING_ART,
  useConfig,
} from "./config"
import { State } from "./Hooks/useOnboardingContext"

describe("config", () => {
  it("should move through workflow", () => {
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
    basis.current.questionThree = OPTION_FOLLOW_GALLERIES_I_LOVE
    expect(workflowEngine.next()).toEqual("VIEW_FOLLOW_GALLERIES")
  })
})
