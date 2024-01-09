import { Screen } from "@artsy/palette-mobile"
import { ActivityContainer } from "app/Scenes/Activity/ActivityContainer"
import { NewActivityHeader } from "app/Scenes/Activity/components/NewActivityHeader"
import { goBack } from "app/system/navigation/navigate"
import { Action, action, createContextStore } from "easy-peasy"

export const NewActivityContent: React.FC = () => {
  const type = ActivityScreenStore.useStoreState((state) => state.type)

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="Activity" />
      <Screen.StickySubHeader title="Activity">
        <NewActivityHeader />
      </Screen.StickySubHeader>
      <ActivityContainer type={type} />
    </Screen>
  )
}

export const NewActivityScreen: React.FC = () => {
  return (
    <ActivityScreenStore.Provider>
      <NewActivityContent />
    </ActivityScreenStore.Provider>
  )
}

export type ActivityType = "all" | "alerts"
export interface ActivityScreenStoreModel {
  type: ActivityType
  setType: Action<this, ActivityType>
}

export const ActivityScreenStore = createContextStore<ActivityScreenStoreModel>({
  type: "all",
  setType: action((state, payload) => {
    state.type = payload
  }),
})
