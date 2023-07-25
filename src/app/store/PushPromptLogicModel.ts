import { Action, action } from "easy-peasy"

export interface PushPromptLogicModel {
  pushPermissionsRequestedThisSession: boolean
  pushNotificationSettingsPromptSeen: boolean
  pushNotificationSystemDialogRejected: boolean
  pushNotificationSystemDialogSeen: boolean
  pushNotificationDialogLastSeenTimestamp: number | null

  setPushPermissionsRequestedThisSession: Action<PushPromptLogicModel, boolean>
  setPushNotificationSettingsPromptSeen: Action<PushPromptLogicModel, boolean>
  setPushNotificationSystemDialogRejected: Action<PushPromptLogicModel, boolean>
  setPushNotificationSystemDialogSeen: Action<PushPromptLogicModel, boolean>
  setPushNotificationDialogLastSeenTimestamp: Action<PushPromptLogicModel, number>
}

export const getPushPromptLogicModel = (): PushPromptLogicModel => ({
  pushPermissionsRequestedThisSession: false,
  pushNotificationSettingsPromptSeen: false,
  pushNotificationSystemDialogRejected: false,
  pushNotificationSystemDialogSeen: false,
  pushNotificationDialogLastSeenTimestamp: null,

  setPushPermissionsRequestedThisSession: action((state, payload) => {
    state.pushPermissionsRequestedThisSession = payload
  }),
  setPushNotificationSettingsPromptSeen: action((state, payload) => {
    state.pushNotificationSettingsPromptSeen = payload
  }),
  setPushNotificationSystemDialogRejected: action((state, payload) => {
    state.pushNotificationSystemDialogRejected = payload
  }),
  setPushNotificationSystemDialogSeen: action((state, payload) => {
    state.pushNotificationSystemDialogSeen = payload
  }),
  setPushNotificationDialogLastSeenTimestamp: action((state, payload) => {
    state.pushNotificationDialogLastSeenTimestamp = payload
  }),
})
