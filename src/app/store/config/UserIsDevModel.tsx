import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { action, Action, computed, Computed, thunkOn, ThunkOn } from "easy-peasy"
import { unsafe__getEnvironment } from "../GlobalStore"
import { GlobalStoreModel } from "../GlobalStoreModel"

export interface UserIsDevModel {
  flipValue: boolean
  value: Computed<this, boolean, GlobalStoreModel>
  setFlipValue: Action<this, UserIsDevModel["flipValue"]>
  onSetFlipValue: ThunkOn<this>
}

export const getUserIsDev = (): UserIsDevModel => ({
  flipValue: false,
  value: computed([(_, store) => store], (store) => {
    let retval = false
    if (__DEV__) {
      retval = true
    }
    if (store.auth.userHasArtsyEmail) {
      retval = true
    }
    return store.artsyPrefs.userIsDev.flipValue ? !retval : retval
  }),
  setFlipValue: action((state, nextValue) => {
    state.flipValue = nextValue
  }),
  onSetFlipValue: thunkOn(
    (actions) => actions.setFlipValue,
    () => {
      LegacyNativeModules.ARNotificationsManager.reactStateUpdated(unsafe__getEnvironment())
    }
  ),
})
