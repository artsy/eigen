import { Action, action } from "easy-peasy"

export interface PushPromptLogicModel {
  pushPermissionsRequestedThisSession: boolean
  pushNotificationSettingsPromptSeen: boolean
  pushNotificationAppleDialogueRejected: boolean
  pushNotificationSystemDialogueSeen: boolean
  pushNotificationDialogueLastSeenTimestamp: number | null

  setPushPermissionsRequestedThisSession: Action<PushPromptLogicModel, boolean>
  setPushNotificationSettingsPromptSeen: Action<PushPromptLogicModel, boolean>
  setPushNotificationAppleDialogueRejected: Action<PushPromptLogicModel, boolean>
  setPushNotificationSystemDialogueSeen: Action<PushPromptLogicModel, boolean>
  setPushNotificationDialogueLastSeenTimestamp: Action<PushPromptLogicModel, number>
}

export const getPushPromptLogicModel = (): PushPromptLogicModel => ({
  pushPermissionsRequestedThisSession: false,
  pushNotificationSettingsPromptSeen: false,
  pushNotificationAppleDialogueRejected: false,
  pushNotificationSystemDialogueSeen: false,
  pushNotificationDialogueLastSeenTimestamp: null,

  setPushPermissionsRequestedThisSession: action((state, payload) => {
    state.pushPermissionsRequestedThisSession = payload
  }),
  setPushNotificationSettingsPromptSeen: action((state, payload) => {
    state.pushNotificationSettingsPromptSeen = payload
  }),
  setPushNotificationAppleDialogueRejected: action((state, payload) => {
    state.pushNotificationAppleDialogueRejected = payload
  }),
  setPushNotificationSystemDialogueSeen: action((state, payload) => {
    state.pushNotificationSystemDialogueSeen = payload
  }),
  setPushNotificationDialogueLastSeenTimestamp: action((state, payload) => {
    state.pushNotificationDialogueLastSeenTimestamp = payload
  }),
})
