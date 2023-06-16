import { Action, action } from "easy-peasy"

export interface PushPromptLogicModel {
  pushPermissionsRequestedThisSession: boolean
  pushNotificationSettingsPromptSeen: boolean
  pushNotificationAppleDialogRejected: boolean
  pushNotificationSystemDialogSeen: boolean
  pushNotificationDialogLastSeenTimestamp: number | null

  setPushPermissionsRequestedThisSession: Action<PushPromptLogicModel, boolean>
  setPushNotificationSettingsPromptSeen: Action<PushPromptLogicModel, boolean>
  setPushNotificationAppleDialogRejected: Action<PushPromptLogicModel, boolean>
  setPushNotificationSystemDialogSeen: Action<PushPromptLogicModel, boolean>
  setPushNotificationDialogLastSeenTimestamp: Action<PushPromptLogicModel, number>
}

export const getPushPromptLogicModel = (): PushPromptLogicModel => ({
  pushPermissionsRequestedThisSession: false,
  pushNotificationSettingsPromptSeen: false,
  pushNotificationAppleDialogRejected: false,
  pushNotificationSystemDialogSeen: false,
  pushNotificationDialogLastSeenTimestamp: null,

  setPushPermissionsRequestedThisSession: action((state, payload) => {
    state.pushPermissionsRequestedThisSession = payload
  }),
  setPushNotificationSettingsPromptSeen: action((state, payload) => {
    state.pushNotificationSettingsPromptSeen = payload
  }),
  setPushNotificationAppleDialogRejected: action((state, payload) => {
    state.pushNotificationAppleDialogRejected = payload
  }),
  setPushNotificationSystemDialogSeen: action((state, payload) => {
    state.pushNotificationSystemDialogSeen = payload
  }),
  setPushNotificationDialogLastSeenTimestamp: action((state, payload) => {
    state.pushNotificationDialogLastSeenTimestamp = payload
  }),
})
