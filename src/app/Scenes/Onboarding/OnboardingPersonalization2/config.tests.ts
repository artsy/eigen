import { renderHook } from "@testing-library/react-hooks"
import { WorkflowEngine } from "app/utils/WorkflowEngine/WorkflowEngine"
import {
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_FOLLOW_GALLERIES_I_LOVE,
  OPTION_TOP_AUCTION_LOTS,
  OPTION_YES_I_LOVE_COLLECTING_ART,
  useConfig,
} from "./config"
import { State } from "./Hooks/useOnboardingContext"

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

  it.only("should move backward through workflow", () => {
    const workflowEngine = new WorkflowEngine({ workflow: ["first", "second", "third", "fourth"] })

    expect(workflowEngine.next()).toEqual("second")
    expect(workflowEngine.current()).toEqual("second")
    expect(workflowEngine.next()).toEqual("third")
    expect(workflowEngine.isEnd()).toBe(false)
    expect(workflowEngine.next()).toEqual("fourth")
    expect(workflowEngine.isEnd()).toBe(true)
    expect(workflowEngine.back()).toEqual("third")
    expect(workflowEngine.current()).toEqual("third")
    expect(workflowEngine.isEnd()).toBe(false)
    expect(workflowEngine.back()).toEqual("second")
    expect(workflowEngine.current()).toEqual("second")
    expect(workflowEngine.isEnd()).toBe(false)
    expect(workflowEngine.back()).toEqual("first")
    expect(workflowEngine.current()).toEqual("first")
    expect(workflowEngine.isEnd()).toBe(false)
    expect(workflowEngine.isStart()).toBe(true)
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
