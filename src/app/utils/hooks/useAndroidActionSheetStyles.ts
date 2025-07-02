import { THEMES, useColor, useSpace } from "@artsy/palette-mobile"
import { ActionSheetOptions } from "@expo/react-native-action-sheet"
import { globalStoreInstance } from "app/store/GlobalStore"
import { DimensionValue } from "react-native"

/**
 * This hook returns the styles for the action sheet on Android.
 * These have no impact on iOS.
 */
export const useAndroidActionSheetStyles = (): Partial<ActionSheetOptions> => {
  const color = useColor()
  const space = useSpace()

  return {
    textStyle: {
      color: color("mono100"),
    },
    titleTextStyle: {
      color: color("mono60"),
    },
    messageTextStyle: {
      color: color("mono60"),
    },
    containerStyle: {
      backgroundColor: color("mono0"),
      paddingBottom: space(2),
    },
    separatorStyle: {
      backgroundColor: color("mono0"),
    },
    useModal: false,
  }
}

/**
 * This is marked as unsafe because it will not cause a re-render
 * if used in a react component. Use `useAndroidActionSheetStyles` instead.
 * It is safe to use in contexts that don't require reactivity.
 */
export const __unsafe__useAndroidActionSheetStyles = (): Partial<ActionSheetOptions> => {
  const state = globalStoreInstance().getState() ?? null

  if (state.devicePrefs.colorScheme === "dark") {
    return {
      textStyle: {
        color: THEMES.v3dark.colors.mono100,
      },
      titleTextStyle: {
        color: THEMES.v3dark.colors.mono60,
      },
      messageTextStyle: {
        color: THEMES.v3dark.colors.mono60,
      },
      containerStyle: {
        backgroundColor: THEMES.v3dark.colors.mono0,
        paddingBottom: THEMES.v3dark.space[2] as DimensionValue,
      },
      useModal: false,
    }
  }

  return {
    textStyle: {
      color: THEMES.v3light.colors.mono100,
    },
    titleTextStyle: {
      color: THEMES.v3light.colors.mono60,
    },
    messageTextStyle: {
      color: THEMES.v3light.colors.mono60,
    },
    containerStyle: {
      backgroundColor: THEMES.v3light.colors.mono0,
      paddingBottom: THEMES.v3light.space[2] as DimensionValue,
    },
    useModal: false,
  }
}
