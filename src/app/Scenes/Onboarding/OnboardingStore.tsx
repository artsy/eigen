import { Action, action, createContextStore } from "easy-peasy"

export interface OnboardingStoreModel {
  currentStep:
    | "WelcomeStep"
    | "EmailStep"
    | "LoginPasswordStep"
    | "SignUpPasswordStep"
    | "NameStep"
    | "ForgotPasswordStep"
  stepForward: Action<OnboardingStoreModel>
  stepBackward: Action<OnboardingStoreModel>
}

export const OnboardingStore = createContextStore<OnboardingStoreModel>({
  currentStep: "WelcomeStep",
  stepForward: action((state) => {
    switch (state.currentStep) {
      case "WelcomeStep":
        return { currentStep: "EmailStep" }
      case "EmailStep":
        return { currentStep: "LoginPasswordStep" }
    }
  }),
  stepBackward: action((state) => {
    switch (state.currentStep) {
      case "EmailStep":
        return { currentStep: "WelcomeStep" }
      case "LoginPasswordStep":
        return { currentStep: "EmailStep" }
    }
  }),
})
