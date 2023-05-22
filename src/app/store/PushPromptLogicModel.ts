import { Action, action } from "easy-peasy"

export interface PushPromptLogicModel {
  pushNotificationSettingsPromptSeen: boolean
  pushNotificationAppleDialogueRejected: boolean
  pushNotificationAppleDialogueSeen: boolean
  pushNotificationDialogueLastSeenDate: Date

  setPushNotificationSettingsPromptSeen: Action<PushPromptLogicModel, boolean>
  setPushNotificationAppleDialogueRejected: Action<PushPromptLogicModel, boolean>
  setPushNotificationAppleDialogueSeen: Action<PushPromptLogicModel, boolean>
  setPushNotificationDialogueLastSeenDate: Action<PushPromptLogicModel, Date>
}

export const getPushPromptLogicModel = (): PushPromptLogicModel => ({
  pushNotificationSettingsPromptSeen: false,
  pushNotificationAppleDialogueRejected: false,
  pushNotificationAppleDialogueSeen: false,
  pushNotificationDialogueLastSeenDate: new Date(),

  setPushNotificationSettingsPromptSeen: action((state, payload) => {
    state.pushNotificationSettingsPromptSeen = payload
  }),
  setPushNotificationAppleDialogueRejected: action((state, payload) => {
    state.pushNotificationAppleDialogueRejected = payload
  }),
  setPushNotificationAppleDialogueSeen: action((state, payload) => {
    state.pushNotificationAppleDialogueSeen = payload
  }),
  setPushNotificationDialogueLastSeenDate: action((state, payload) => {
    state.pushNotificationDialogueLastSeenDate = payload
  }),
})
