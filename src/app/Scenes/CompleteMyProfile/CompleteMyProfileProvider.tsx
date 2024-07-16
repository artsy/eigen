import { EditableLocation } from "__generated__/useUpdateMyProfileMutation.graphql"
import { Routes } from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import { StepsResult } from "app/Scenes/CompleteMyProfile/hooks/useCompleteMyProfileSteps"
import { Action, Computed, action, computed, createContextStore } from "easy-peasy"

export type ProgressState = {
  profession?: string
  location?: Partial<EditableLocation>
  iconUrl?: { localPath: string; geminiUrl: string }
  isIdentityVerified?: boolean
}

type ActionPayload = { type: keyof ProgressState; value: ProgressState[keyof ProgressState] }

export const ROUTE_ACTION_TYPES: Record<Exclude<Routes, "ChangesSummary">, keyof ProgressState> = {
  LocationStep: "location",
  ProfessionStep: "profession",
  AvatarStep: "iconUrl",
  IdentityVerificationStep: "isIdentityVerified",
}

export interface CompleteMyProfileStoreModel {
  steps: StepsResult
  progressState: ProgressState
  setSteps: Action<this, StepsResult>
  setProgressState: Action<this, ActionPayload>
  progressStateWithoutUndefined: Computed<this, ProgressState>
}

export const model: CompleteMyProfileStoreModel = {
  steps: "loading",
  progressState: {},
  setSteps: action((state, steps) => {
    state.steps = steps
  }),
  setProgressState: action((state, action) => {
    state.progressState = { ...state.progressState, [action.type]: action.value }
  }),
  progressStateWithoutUndefined: computed((state) => {
    return Object.entries(state.progressState)
      .filter(([_, value]) => !!value)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  }),
}

export const CompleteMyProfileStore = createContextStore(model)
