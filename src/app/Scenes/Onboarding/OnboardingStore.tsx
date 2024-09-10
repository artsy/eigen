import { createContextStore } from "easy-peasy"

export interface OnboardingStoreModel {
  step:
    | "WelcomeStep"
    | "EmailStep"
    | "LoginPasswordStep"
    | "SignUpPasswordStep"
    | "NameStep"
    | "ForgotPasswordStep"
}

export const OnboardingStore = createContextStore<OnboardingStoreModel>((runtimeModel) => {
  return {
    step: "WelcomeStep",
    ...runtimeModel,
  }
})
