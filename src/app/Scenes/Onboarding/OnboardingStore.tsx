import { Action, action, createContextStore } from "easy-peasy"

export type OnboardingStoreStep =
  | "WelcomeStep"
  | "EmailStep"
  | "LoginPasswordStep"
  | "SignUpPasswordStep"

export interface OnboardingStoreModel {
  currentStep: OnboardingStoreStep
  navigateToWelcomeStep: Action<OnboardingStoreModel>
  navigateToEmailStep: Action<OnboardingStoreModel>
  navigateToLoginPasswordStep: Action<OnboardingStoreModel>
  navigateToSignUpPasswordStep: Action<OnboardingStoreModel>
  changeStep: Action<OnboardingStoreModel, OnboardingStoreStep>
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
  changeStep: action((state, payload) => {
    state.currentStep = payload
  }),
})
