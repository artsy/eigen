import { __unsafe_mainModalStackRef } from "app/NativeModules/ARScreenPresenterModule"

export const setBottomTabVisibilityForCurrentScreen = (isVisible: boolean) => {
  if (__unsafe_mainModalStackRef.current) {
    __unsafe_mainModalStackRef.current.setParams({
      shouldHideBottomTab: !isVisible,
    })
  } else {
    console.error("ModalStack reference is NULL")
  }
}
