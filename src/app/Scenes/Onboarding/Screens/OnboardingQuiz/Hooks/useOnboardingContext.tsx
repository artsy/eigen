import { useConfig } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/config"
import { WorkflowEngine } from "app/utils/WorkflowEngine/WorkflowEngine"
import { createContext, useContext, useEffect, useReducer, useRef } from "react"

export interface State {
  questionOne: string | null
  questionTwo: string[]
  questionThree: string | null
  priceRange: string | null
  followedIds: string[]
}

export const DEFAULT_STATE: State = {
  questionOne: null,
  questionTwo: [],
  questionThree: null,
  priceRange: null,
  followedIds: [],
}

export type OnboardingContextAction =
  | { type: "RESET" }
  | { type: "SET_ANSWER_ONE"; payload: string }
  | { type: "SET_ANSWER_TWO"; payload: string }
  | { type: "SET_ANSWER_THREE"; payload: string }
  | { type: "SET_PRICE_RANGE"; payload: string }
  | { type: "FOLLOW"; payload: string }

const reducer = (onReset: () => void) => (state: State, action: OnboardingContextAction) => {
  switch (action.type) {
    case "RESET":
      onReset()
      return DEFAULT_STATE

    case "SET_ANSWER_ONE":
      return {
        ...state,
        questionOne: action.payload,
      }

    case "SET_ANSWER_TWO":
      return {
        ...state,
        questionTwo: state.questionTwo.includes(action.payload)
          ? state.questionTwo.filter((answer) => answer !== action.payload)
          : [...state.questionTwo, action.payload],
      }

    case "SET_ANSWER_THREE":
      return {
        ...state,
        questionThree: action.payload,
      }

    case "SET_PRICE_RANGE":
      return {
        ...state,
        priceRange: action.payload,
      }

    case "FOLLOW":
      return {
        ...state,
        followedIds: state.followedIds.includes(action.payload)
          ? state.followedIds.filter((id) => id !== action.payload)
          : [...state.followedIds, action.payload],
      }

    default:
      return state
  }
}

const OnboardingContext = createContext<{
  current: string | undefined
  dispatch: React.Dispatch<OnboardingContextAction>
  progress: number
  state: State
  workflowEngine: WorkflowEngine
  next(): void
  back(): void
  onDone(): void
}>({
  current: "",

  dispatch: () => {},

  next: () => {},

  back: () => {},

  onDone: () => {},
  progress: 0,
  state: DEFAULT_STATE,
  workflowEngine: new WorkflowEngine({ workflow: [] }),
})

interface OnboardingProviderProps {
  onDone(): void
}

export const OnboardingProvider: React.FC<React.PropsWithChildren<OnboardingProviderProps>> = ({
  children,
  onDone,
}) => {
  const basis = useRef<State>(DEFAULT_STATE)

  const {
    workflowEngine,
    back,
    current,
    next,

    reset: __reset__,
  } = useConfig({
    basis,
    onDone,
  })

  const [state, dispatch] = useReducer(reducer(__reset__), DEFAULT_STATE)

  useEffect(() => {
    basis.current = state
  }, [state])

  const progress = ((workflowEngine.position() - 1) / workflowEngine.total()) * 100

  return (
    <OnboardingContext.Provider
      value={{
        back,
        current,
        dispatch,
        next,
        onDone,
        progress,
        state,
        workflowEngine,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboardingContext = () => {
  return useContext(OnboardingContext)
}
