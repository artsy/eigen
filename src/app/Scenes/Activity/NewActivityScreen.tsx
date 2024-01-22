import { Screen } from "@artsy/palette-mobile"
import { ActivityContainer } from "app/Scenes/Activity/ActivityContainer"
import { ActivityScreenStore } from "app/Scenes/Activity/ActivityScreenStore"
import { NewActivityHeader } from "app/Scenes/Activity/components/NewActivityHeader"
import { goBack } from "app/system/navigation/navigate"

// TODO: Remove New from the name once we remove the old Activity screen
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
