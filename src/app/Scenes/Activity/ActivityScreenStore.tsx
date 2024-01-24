import { NotificationType } from "app/Scenes/Activity/types"
import { Action, action, createContextStore } from "easy-peasy"

export interface ActivityScreenStoreModel {
  type: NotificationType
  setType: Action<this, NotificationType>
}

export const ActivityScreenStore = createContextStore<ActivityScreenStoreModel>({
  type: "all",
  setType: action((state, payload) => {
    state.type = payload
  }),
})
