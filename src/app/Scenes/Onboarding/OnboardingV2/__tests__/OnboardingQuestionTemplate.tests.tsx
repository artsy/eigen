import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { OnboardingQuestionTemplate } from "app/Scenes/Onboarding/OnboardingV2/Components/OnboardingQuestionTemplate"
import { useOnboardingContext } from "app/Scenes/Onboarding/OnboardingV2/Hooks/useOnboardingContext"
import { renderWithWrappers } from "app/tests/renderWithWrappers"

jest.mock("app/Scenes/Onboarding/OnboardingV2/Hooks/useOnboardingContext")
const useOnboardingContextMock = useOnboardingContext as jest.Mock

jest.mock("app/Scenes/Onboarding/OnboardingV2/Hooks/useOnboardingTracking")

const contextValue = (answer: string | null = null) => ({
  dispatch: jest.fn(),
  next: jest.fn(),
  onDone: jest.fn(),
  state: {
    questionOne: answer,
  },
})

describe("onboarding question template", () => {
  beforeEach(() => {
    useOnboardingContextMock.mockReset()
  })

  it.each(["Skip", "question", "subtitle", "answer 1", "answer 2", "Next"])(
    "renders expected element %s",
    (text) => {
      useOnboardingContextMock.mockReturnValue(contextValue())

      renderWithWrappers(
        <OnboardingQuestionTemplate
          answers={["answer 1", "answer 2"]}
          action="SET_ANSWER_ONE"
          onNext={jest.fn()}
          question="question"
          subtitle="subtitle"
        />
      )

      expect(screen.getByText(text)).toBeTruthy()
    }
  )

  it("calls onNext if item is selected", () => {
    useOnboardingContextMock.mockReturnValue(contextValue("answer 2"))
    const onNext = jest.fn()

    renderWithWrappers(
      <OnboardingQuestionTemplate
        answers={["answer 1", "answer 2"]}
        action="SET_ANSWER_ONE"
        onNext={onNext}
        question="question"
      />
    )

    fireEvent.press(screen.getByText("Next"))

    waitFor(() => {
      expect(onNext).toHaveBeenCalledTimes(1)
    })
  })

  it("does not call onNext if no item is selected", () => {
    useOnboardingContextMock.mockReturnValue(contextValue())
    const onNext = jest.fn()

    renderWithWrappers(
      <OnboardingQuestionTemplate
        answers={["answer 1", "answer 2"]}
        action="SET_ANSWER_ONE"
        onNext={onNext}
        question="question"
      />
    )

    fireEvent.press(screen.getByText("Next"))

    expect(onNext).not.toHaveBeenCalled()
  })
})
