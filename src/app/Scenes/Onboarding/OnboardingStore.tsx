import { Action, action, createContextStore } from "easy-peasy"

export interface OnboardingStoreModel {
  currentStep: "WelcomeStep" | "EmailStep" | "LoginPasswordStep" | "SignUpPasswordStep"
  navigateToWelcomeStep: Action<OnboardingStoreModel>
  navigateToEmailStep: Action<OnboardingStoreModel>
  navigateToLoginPasswordStep: Action<OnboardingStoreModel>
  navigateToSignUpPasswordStep: Action<OnboardingStoreModel>
}

export const OnboardingStore = createContextStore<OnboardingStoreModel>({
  currentStep: "WelcomeStep",
  navigateToWelcomeStep: action((state) => {
    state.currentStep = "WelcomeStep"
  }),
  navigateToEmailStep: action((state) => {
    state.currentStep = "EmailStep"
  }),
  navigateToLoginPasswordStep: action((state) => {
    state.currentStep = "LoginPasswordStep"
  }),
  navigateToSignUpPasswordStep: action((state) => {
    state.currentStep = "SignUpPasswordStep"
  }),
})
